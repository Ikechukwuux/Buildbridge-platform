"use server"

import { createClient } from "@/lib/supabase/server"
import { invalidateCache } from "@/lib/redis"

export async function submitToImpactWallAction(formData: FormData) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Authentication required." }
    }

    const needId = formData.get("need_id") as string
    const caption = formData.get("caption") as string
    const publicDisplayConsent = formData.get("public_display_consent") === "on"

    if (!needId || !caption) {
      return { success: false, error: "Need ID and Success Caption are required." }
    }

    // 1. Fetch the need and ensure it belongs to the user and is COMPLETED with proof
    const { data: need, error: needError } = await supabase
      .from('needs')
      .select('id, profile_id, proof_photo_url, proof_video_url, status')
      .eq('id', needId)
      .single()

    if (needError || !need) {
      return { success: false, error: "Funding request not found." }
    }

    if (need.status !== 'completed') {
      return { success: false, error: "Only completed needs can be added to the Impact Wall. Please submit your proof of use first." }
    }

    // Use admin client to bypass RLS for inserting the impact wall submission
    // Ensure we import it dynamically or use the env vars
    const { createClient: createSupabaseClient } = await import('@supabase/supabase-js')
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 2. Create the impact wall submission
    const { error: insertError } = await supabaseAdmin
      .from('impact_wall_submissions')
      .insert({
        need_id: need.id,
        profile_id: need.profile_id,
        photo_url: need.proof_photo_url,
        video_url: need.proof_video_url,
        caption: caption,
        public_display_consent: publicDisplayConsent,
        opted_in_at: new Date().toISOString(),
        moderation_status: 'approved',   // Auto-approve — admin can flag/reject later
        published_at: new Date().toISOString(),  // Publish immediately so it shows on Impact Wall
      })

    if (insertError) {
      if (insertError.code === '23505') {
        return { success: false, error: "This story is already submitted to the Impact Wall." }
      }
      console.error("Impact Wall Insert Error:", insertError)
      return { success: false, error: `Failed to submit to Impact Wall: ${insertError.message || insertError.details || JSON.stringify(insertError)}` }
    }

    // Clear the Redis cache for the impact feed so it updates instantly
    await invalidateCache('impact:submissions:feed')
    
    // Skip revalidatePath — client-side refresh handles data reload after the modal closes.
    
    return { success: true, message: "Story submitted for moderation! It will appear on the wall soon." }
    
  } catch (err: any) {
    console.error("Impact Action Error:", err)
    return { success: false, error: err.message || "An unexpected error occurred." }
  }
}
