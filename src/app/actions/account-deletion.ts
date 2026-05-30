"use server"

import { createClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"

export type DeletionStatus = "pending" | "processing" | "completed" | "cancelled"

/**
 * Submit a deletion request for the currently authenticated user.
 * Per NDPA 2023 the deletion / anonymisation must be completed within 30 days.
 */
export async function requestAccountDeletion(reason?: string) {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { success: false, error: "Not authenticated." }
  }

  // Block duplicate open requests up-front. RLS allows the read.
  const { data: existing } = await supabase
    .from("account_deletion_requests")
    .select("id, status")
    .eq("user_id", user.id)
    .in("status", ["pending", "processing"])
    .maybeSingle()

  if (existing) {
    return {
      success: false,
      error: "You already have an open deletion request. We'll process it within 30 days.",
    }
  }

  const { error: insertError } = await supabase
    .from("account_deletion_requests")
    .insert({
      user_id: user.id,
      email: user.email || null,
      reason: reason?.slice(0, 1000) || null,
    })

  if (insertError) {
    console.error("[requestAccountDeletion] insert failed:", insertError)
    return { success: false, error: "Couldn't submit your request. Please try again or email privacy@buildbridge.africa." }
  }

  return { success: true }
}

export async function getMyDeletionRequest() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from("account_deletion_requests")
    .select("id, status, requested_at, processed_at")
    .eq("user_id", user.id)
    .in("status", ["pending", "processing"])
    .order("requested_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  return data
}

export async function cancelMyDeletionRequest(requestId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated." }

  const { error } = await supabase
    .from("account_deletion_requests")
    .update({ status: "cancelled" })
    .eq("id", requestId)
    .eq("user_id", user.id)
    .eq("status", "pending")

  if (error) {
    console.error("[cancelMyDeletionRequest] update failed:", error)
    return { success: false, error: "Couldn't cancel. Please try again." }
  }
  return { success: true }
}

// ── Admin actions ──

export async function fetchPendingDeletionRequests() {
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabaseAdmin
    .from("account_deletion_requests")
    .select("id, user_id, email, reason, status, requested_at")
    .in("status", ["pending", "processing"])
    .order("requested_at", { ascending: true })

  if (error) throw new Error(error.message)
  return data || []
}

export async function markDeletionRequestProcessed(
  requestId: string,
  notes?: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error } = await supabaseAdmin
    .from("account_deletion_requests")
    .update({
      status: "completed",
      processed_at: new Date().toISOString(),
      processed_by: user.id,
      admin_notes: notes || null,
    })
    .eq("id", requestId)

  if (error) throw new Error(error.message)
  revalidatePath("/admin")
  return { success: true }
}
