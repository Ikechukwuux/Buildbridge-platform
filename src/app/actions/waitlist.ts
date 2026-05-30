"use server"

import { createClient as createAdminClient } from "@supabase/supabase-js"

export async function joinWaitlist(
  email: string,
  userType: "artisan" | "donor",
  source = "coming_soon"
): Promise<{ success: boolean; error?: string; alreadyJoined?: boolean }> {
  if (!email || !email.includes("@") || !email.includes(".")) {
    return { success: false, error: "Please enter a valid email address." }
  }
  if (!["artisan", "donor"].includes(userType)) {
    return { success: false, error: "Invalid user type." }
  }

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error } = await supabaseAdmin.from("waitlist").insert({
    email: email.trim().toLowerCase(),
    user_type: userType,
    source,
  })

  if (error) {
    if (error.code === "23505") {
      // Duplicate email — already on the list
      return { success: true, alreadyJoined: true }
    }
    console.error("[joinWaitlist] insert failed:", error)
    return {
      success: false,
      error: "Couldn't save your spot. Please try again or email hello@buildbridge.africa.",
    }
  }

  return { success: true }
}
