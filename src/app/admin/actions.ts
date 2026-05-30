"use server"

import { createClient as createAdminClient } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")
  if (user.app_metadata?.role !== "admin") throw new Error("Forbidden")
  return user
}

export async function approveNeed(needId: string) {
  const user = await requireAdmin()

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error } = await supabaseAdmin
    .from("needs")
    .update({ status: "active", published_at: new Date().toISOString() })
    .eq("id", needId)

  if (error) throw new Error(error.message)

  revalidatePath("/admin")
  return { success: true }
}

export async function rejectNeed(needId: string) {
  const user = await requireAdmin()

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error } = await supabaseAdmin
    .from("needs")
    .update({ status: "rejected" })
    .eq("id", needId)

  if (error) throw new Error(error.message)

  revalidatePath("/admin")
  return { success: true }
}

export async function fetchPendingNeeds() {
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabaseAdmin
    .from("needs")
    .select(`
      *,
      profiles:profile_id (
        id,
        full_name,
        trade_category,
        location_state,
        location_lga
      )
    `)
    .eq("status", "pending_review")
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

// ── Verification (NIN/BVN) Admin Actions ──

export async function fetchPendingVerifications() {
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabaseAdmin
    .from("verifications")
    .select(`
      *,
      profile:profile_id (
        id,
        full_name,
        trade_category,
        location_state,
        location_lga,
        user_id
      )
    `)
    .eq("manual_review_required", true)
    .eq("manual_review_completed", false)
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

export async function approveVerification(verificationId: string) {
  const user = await requireAdmin()

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Get the verification record to find the profile
  const { data: verification } = await supabaseAdmin
    .from("verifications")
    .select("profile_id")
    .eq("id", verificationId)
    .single()

  if (!verification) throw new Error("Verification not found")

  // Update verification as approved
  const { error } = await supabaseAdmin
    .from("verifications")
    .update({
      verified: true,
      manual_review_completed: true,
      nin_verified_at: new Date().toISOString(),
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", verificationId)

  if (error) throw new Error(error.message)

  // Upgrade profile badge to Level 4 (Platform Verified)
  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .update({
      badge_level: "level_4_platform_verified",
      updated_at: new Date().toISOString(),
    })
    .eq("id", verification.profile_id)

  if (profileError) throw new Error(profileError.message)

  revalidatePath("/admin")
  return { success: true }
}

// ── Proof Review (Milestone / Funded Need) Admin Actions ──

export async function fetchPendingProofs() {
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabaseAdmin
    .from("needs")
    .select(`
      id, item_name, item_cost, funded_amount, status,
      proof_photo_url, proof_video_url, proof_caption, proof_submitted_at,
      profiles:profile_id (
        id, full_name, trade_category, location_state, location_lga
      )
    `)
    .not("proof_submitted_at", "is", null)
    .is("disbursed_at", null)
    .in("status", ["funded", "active"])
    .order("proof_submitted_at", { ascending: true })

  if (error) throw new Error(error.message)
  return data || []
}

export async function approveProof(needId: string) {
  const user = await requireAdmin()

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: need, error: needErr } = await supabaseAdmin
    .from("needs")
    .select(`
      id, item_name, funded_amount, status, disbursed_at, transfer_reference,
      profiles:profile_id (
        id, full_name,
        bank_account_number, bank_code, paystack_recipient_code
      )
    `)
    .eq("id", needId)
    .single()

  if (needErr || !need) throw new Error("Need not found")
  if (need.disbursed_at || need.transfer_reference) throw new Error("Already disbursed")

  const profile = Array.isArray(need.profiles) ? need.profiles[0] : (need.profiles as any)
  if (!profile?.bank_account_number || !profile?.bank_code) {
    throw new Error("Artisan has not added bank account details. They must add their bank information before this need can be disbursed.")
  }

  const { createTransferRecipient, initiateTransfer } = await import("@/lib/paystack")
  const crypto = await import("crypto")

  let recipientCode = profile.paystack_recipient_code
  if (!recipientCode) {
    const recipientRes = await createTransferRecipient({
      name: profile.full_name || "Artisan",
      account_number: profile.bank_account_number,
      bank_code: profile.bank_code,
    })
    if (!recipientRes.status) throw new Error(`Could not create transfer recipient: ${recipientRes.message}`)
    recipientCode = recipientRes.data.recipient_code
    await supabaseAdmin
      .from("profiles")
      .update({ paystack_recipient_code: recipientCode })
      .eq("id", profile.id)
  }

  const transferRef = `bb-disburse-${needId.slice(0, 8)}-${crypto.randomBytes(4).toString("hex")}`
  const transferRes = await initiateTransfer({
    amount: Math.floor(need.funded_amount),
    recipient: recipientCode,
    reason: `BuildBridge disbursement: ${need.item_name}`,
    reference: transferRef,
  })
  if (!transferRes.status) throw new Error(`Transfer failed: ${transferRes.message}`)

  const { error: updateErr } = await supabaseAdmin
    .from("needs")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
      disbursed_at: new Date().toISOString(),
      disbursement_amount: need.funded_amount,
      disbursement_reference: transferRes.data.transfer_code,
      transfer_reference: transferRef,
      moderated_by: user.id,
      moderated_at: new Date().toISOString(),
    })
    .eq("id", needId)

  if (updateErr) throw new Error(updateErr.message)

  revalidatePath("/admin")
  return { success: true, transfer_code: transferRes.data.transfer_code }
}

export async function rejectProof(needId: string, reason?: string) {
  const user = await requireAdmin()

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Clear proof so artisan can resubmit; record moderator note.
  const { error } = await supabaseAdmin
    .from("needs")
    .update({
      proof_submitted_at: null,
      moderation_notes: reason || "Proof rejected by admin — please resubmit with clearer evidence.",
      moderated_by: user.id,
      moderated_at: new Date().toISOString(),
    })
    .eq("id", needId)

  if (error) throw new Error(error.message)

  revalidatePath("/admin")
  return { success: true }
}

// ── Platform Stats ──

export async function fetchPlatformStats() {
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const [
    profilesRes,
    needsActiveRes,
    needsFundedRes,
    needsCompletedRes,
    needsPendingRes,
    pledgesRes,
    verificationsPendingRes,
  ] = await Promise.all([
    supabaseAdmin.from("profiles").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("needs").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabaseAdmin.from("needs").select("id", { count: "exact", head: true }).eq("status", "funded"),
    supabaseAdmin.from("needs").select("id", { count: "exact", head: true }).eq("status", "completed"),
    supabaseAdmin.from("needs").select("id", { count: "exact", head: true }).eq("status", "pending_review"),
    supabaseAdmin.from("pledges").select("amount, fee_breakdown_json").eq("payment_status", "completed"),
    supabaseAdmin
      .from("verifications")
      .select("id", { count: "exact", head: true })
      .eq("manual_review_required", true)
      .eq("manual_review_completed", false),
  ])

  const totalPledged = (pledgesRes.data || []).reduce(
    (sum: number, p: any) => sum + (Number(p.amount) || 0),
    0
  )
  const totalToArtisans = (pledgesRes.data || []).reduce(
    (sum: number, p: any) => sum + (Number(p.fee_breakdown_json?.tradesperson_receives) || 0),
    0
  )

  return {
    profilesCount: profilesRes.count || 0,
    needsActive: needsActiveRes.count || 0,
    needsFunded: needsFundedRes.count || 0,
    needsCompleted: needsCompletedRes.count || 0,
    needsPendingReview: needsPendingRes.count || 0,
    pledgesCount: pledgesRes.data?.length || 0,
    totalPledgedKobo: totalPledged,
    totalToArtisansKobo: totalToArtisans,
    verificationsPending: verificationsPendingRes.count || 0,
  }
}

export async function rejectVerification(verificationId: string) {
  const user = await requireAdmin()

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error } = await supabaseAdmin
    .from("verifications")
    .update({
      verified: false,
      verification_failed: true,
      manual_review_completed: true,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", verificationId)

  if (error) throw new Error(error.message)

  revalidatePath("/admin")
  return { success: true }
}
