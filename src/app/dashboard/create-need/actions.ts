"use server"

import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/server"
import { invalidateCache } from "@/lib/redis"

export async function createNeedAction(formData: FormData) {
  const supabase = await createClient()

  // 1. Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Authentication required")

  // 2. Fetch profile_id
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .single()

  if (!profile) throw new Error("Tradesperson profile not found")

  // 3. Extract and Validate
  const itemName = formData.get("item_name") as string
  const customItem = formData.get("custom_item") as string
  const finalItemName = itemName === "custom" ? customItem : itemName
  
  const rawCost = formData.get("item_cost") as string
  const itemCostKobo = parseInt(rawCost.replace(/[^0-9]/g, "")) * 100
  
  const story = formData.get("story") as string
  const impact = formData.get("impact_statement") as string
  const deadlineDays = parseInt(formData.get("deadline_days") as string)
  const lat = formData.get("geotag_lat") ? parseFloat(formData.get("geotag_lat") as string) : null
  const lng = formData.get("geotag_lng") ? parseFloat(formData.get("geotag_lng") as string) : null
  const photoFile = formData.get("photo_file") as File

  if (!finalItemName || itemCostKobo <= 0 || !story || !photoFile) {
    throw new Error("Missing required fields")
  }

  if (itemCostKobo > 100000000) { // Max 1M Naira = 100M Kobo
    throw new Error("Maximum request limit is NGN 1,000,000")
  }

  // 4. Upload photo to 'needs' bucket
  const fileExt = photoFile.name.split('.').pop()
  const fileName = `${user.id}-${Date.now()}.${fileExt}`
  const filePath = `covers/${fileName}`

  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Pass the native File object directly — Supabase JS supports it natively

  const { error: uploadError } = await supabaseAdmin.storage
    .from("needs")
    .upload(filePath, photoFile, {
      contentType: photoFile.type,
      upsert: false,
    })

  if (uploadError) throw new Error(`Failed to upload photo: ${uploadError.message}`)

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from("needs")
    .getPublicUrl(filePath)

  // 5. Calculate deadline date
  const deadlineDate = new Date()
  deadlineDate.setDate(deadlineDate.getDate() + deadlineDays)

  // 6. Insert into Database
  // Get profile location for need denormalization
  const { data: fullProfile } = await supabase
    .from("profiles")
    .select("location_state, location_lga")
    .eq("id", profile.id)
    .single()

  const { error: dbError } = await supabase
    .from("needs")
    .insert({
      profile_id: profile.id,
      item_name: finalItemName,
      item_cost: itemCostKobo,
      photo_url: publicUrl,
      photo_geotag_lat: lat,
      photo_geotag_lng: lng,
      story: story,
      impact_statement: impact,
      deadline: deadlineDate.toISOString().split('T')[0], // DATE format
      status: "pending_review",
      location_state: fullProfile?.location_state || null,
      location_lga: fullProfile?.location_lga || null,
    })

  if (dbError) {
    console.error("DB Error:", dbError)
    throw new Error(`Database error: ${dbError.message}`)
  }

  // Clear the active needs cache just in case we switch to auto-approve later
  await invalidateCache('browse:needs:active')

  // NOTE: Do NOT call revalidatePath("/dashboard") here.
  // It forces Next.js to remount the create-need layout, resetting
  // client-side currentStep state back to 0 and preventing the
  // congratulatory success step from being displayed.
  // Instead, the "Go to Dashboard" button on the success step
  // triggers router.refresh() to pick up the new data.
  return { success: true }
}
