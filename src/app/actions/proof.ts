"use server"

import { createClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"

/**
 * submitProofOfUseAction
 *
 * Called when a funded tradesperson submits their proof-of-use update.
 * Steps:
 *  1. Auth check
 *  2. Validate the need belongs to the user and is sufficiently funded
 *  3. Upload proof photo to Supabase Storage (needs/proofs/)
 *  4. Update the needs record: proof fields + status = 'completed'
 *  5. Increment profiles.delivered_count
 *  6. Revalidate cache
 */
export async function submitProofOfUseAction(formData: FormData) {
  try {
    const supabase = await createClient()
    if (!supabase) return { success: false, error: "Service unavailable." }

    // 1. Auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: "Authentication required." }

    const needId = formData.get("need_id") as string
    const caption = formData.get("proof_caption") as string
    const photoFile = formData.get("proof_photo") as File | null

    if (!needId || !caption || caption.length < 10) {
      return { success: false, error: "Need ID and a caption (at least 10 characters) are required." }
    }

    // 2. Fetch and validate the need
    const { data: need, error: needError } = await supabase
      .from("needs")
      .select("id, profile_id, item_cost, funded_amount, status, proof_submitted_at")
      .eq("id", needId)
      .single()

    if (needError || !need) {
      return { success: false, error: "Funding request not found." }
    }

    // Verify ownership
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (!profile || profile.id !== need.profile_id) {
      return { success: false, error: "You do not have permission to update this need." }
    }

    // Check if already submitted
    if (need.proof_submitted_at) {
      return { success: false, error: "Proof has already been submitted for this need." }
    }

    // Check need is funded (using ratio check per plan)
    const isFunded = need.item_cost > 0 && (need.funded_amount || 0) >= need.item_cost
    if (!isFunded) {
      return { success: false, error: "This need has not been fully funded yet." }
    }

    // 3. Upload proof photo (if provided)
    let proofPhotoUrl: string | null = null

    if (photoFile && photoFile.size > 0) {
      const supabaseAdmin = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      const fileExt = photoFile.name.split(".").pop() || "jpg"
      const fileName = `proof-${user.id}-${needId}-${Date.now()}.${fileExt}`
      const filePath = `proofs/${fileName}`

      const { error: uploadError } = await supabaseAdmin.storage
        .from("needs")
        .upload(filePath, photoFile, {
          contentType: photoFile.type,
          upsert: false,
        })

      if (uploadError) {
        return { success: false, error: `Photo upload failed: ${uploadError.message}` }
      }

      const { data: { publicUrl } } = supabaseAdmin.storage
        .from("needs")
        .getPublicUrl(filePath)

      proofPhotoUrl = publicUrl
    }

    // 4. Update the need record
    const updatePayload: Record<string, any> = {
      proof_caption: caption,
      proof_submitted_at: new Date().toISOString(),
      status: "completed",
    }
    if (proofPhotoUrl) {
      updatePayload.proof_photo_url = proofPhotoUrl
    }

    const { error: updateError } = await supabase
      .from("needs")
      .update(updatePayload)
      .eq("id", needId)

    if (updateError) {
      return { success: false, error: "Failed to save proof update." }
    }

    // 5. Increment delivered_count on the profile
    const { error: rpcError } = await supabase.rpc("increment_delivered_count", {
      profile_id_input: profile.id,
    })

    // If RPC doesn't exist yet, fall back to a direct update
    if (rpcError) {
      const { data: currentProfile } = await supabase
        .from("profiles")
        .select("delivered_count")
        .eq("id", profile.id)
        .single()

      await supabase
        .from("profiles")
        .update({ delivered_count: (currentProfile?.delivered_count || 0) + 1 })
        .eq("id", profile.id)
    }

    // 6. Revalidate
    revalidatePath("/dashboard")
    revalidatePath(`/dashboard/needs/${needId}`)

    return {
      success: true,
      message: "Proof submitted! Your backers have been notified.",
      needId,
    }
  } catch (err: any) {
    console.error("submitProofOfUseAction error:", err)
    return { success: false, error: err.message || "An unexpected error occurred." }
  }
}
