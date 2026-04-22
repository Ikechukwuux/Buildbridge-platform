"use server"

import { createClient } from "@supabase/supabase-js"

export async function adminSyncPhoneUser(phone: string, fullName: string = "Tradesperson") {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return { success: false, error: "Server configuration missing admin keys." }
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  const email = `${phone.replace(/[^0-9]/g, '')}@buildbridge.app`
  const password = `buildbridge-${phone.replace(/[^0-9]/g, '')}`

  try {
    const { data: user, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        phone,
        phone_verified: true,
      }
    })

    if (error) {
      if (error.message.includes('already been registered') || error.message.includes('already exists')) {
        // Find existing user and force confirm
        const { data: linkData } = await supabaseAdmin.auth.admin.generateLink({
          type: 'magiclink',
          email,
        })
        
        if (linkData && linkData.user) {
          await supabaseAdmin.auth.admin.updateUserById(linkData.user.id, {
            email_confirm: true,
            user_metadata: {
              ...linkData.user.user_metadata,
              phone_verified: true,
            }
          })

          // Sync to public.users table
          await supabaseAdmin.from('users').upsert({
            id: linkData.user.id,
            phone: phone,
            name: linkData.user.user_metadata?.full_name || fullName || "Tradesperson",
            phone_verified_at: linkData.user.user_metadata?.phone_verified ? undefined : new Date().toISOString()
          }, { onConflict: 'id' })
        }
        return { success: true, message: "User already exists." }
      }
      console.error("Admin sync error:", error)
      return { success: false, error: error.message }
    }

    if (user && user.user) {
      // Sync to public.users table
      await supabaseAdmin.from('users').upsert({
        id: user.user.id,
        phone: phone,
        name: fullName || "Tradesperson",
        phone_verified_at: new Date().toISOString()
      }, { onConflict: 'id' })
    }

    return { success: true, message: "Created new user successfully." }
  } catch (error: any) {
    console.error("Fatal admin sync error:", error)
    return { success: false, error: error.message }
  }
}
