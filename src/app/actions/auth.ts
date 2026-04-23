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

          // Also sync to public.profiles table
          await supabaseAdmin.from('profiles').upsert({
            user_id: linkData.user.id,
            full_name: linkData.user.user_metadata?.full_name || fullName || "Tradesperson",
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' })
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

      // Also sync to public.profiles table
      await supabaseAdmin.from('profiles').upsert({
        user_id: user.user.id,
        full_name: fullName || "Tradesperson",
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })
    }

    return { success: true, message: "Created new user successfully." }
  } catch (error: any) {
    console.error("Fatal admin sync error:", error)
    return { success: false, error: error.message }
  }
}

export async function syncUserRecord(userId: string, name: string, identifier: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return { success: false, error: "Server configuration missing admin keys." }
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  try {
    const isEmail = identifier.includes("@");
    
    // 1. Ensure public.users record exists (FK target)
    const { error: userError } = await supabaseAdmin.from('users').upsert({
      id: userId,
      name: name || "Artisan",
      phone: isEmail ? `email-${userId.slice(0, 8)}` : identifier, // Fallback for NOT NULL phone
      email: isEmail ? identifier : `${identifier.replace(/[^0-9]/g, '')}@buildbridge.app`,
      phone_verified_at: new Date().toISOString(), // Fixes constraint "phone_verified_when_registered"
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });

    if (userError) throw userError;

    // 2. Ensure public.profiles record exists
    const { error: profileError } = await supabaseAdmin.from('profiles').upsert({
      user_id: userId,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });

    if (profileError) throw profileError;

    return { success: true };
  } catch (error: any) {
    console.error("User sync failed:", error);
    return { success: false, error: error.message };
  }
}

export async function registerUserAdmin(data: { identifier: string, name: string, password: string }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return { success: false, error: "Server configuration missing admin keys." }
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  let email = data.identifier;
  const isEmail = email.includes("@");
  if (!isEmail) {
    let clean = email.trim();
    if (clean.startsWith("0") && clean.length === 11) clean = "+234" + clean.slice(1);
    else if (!clean.startsWith("+")) clean = "+234" + clean;
    email = `${clean.replace(/[^0-9]/g, '')}@buildbridge.app`;
  }

  try {
    // 1. Create user via Admin API (bypasses verification)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: data.password,
      email_confirm: true, // AUTO-VERIFY
      user_metadata: {
        full_name: data.name,
        is_tradesperson: true,
        phone: isEmail ? null : data.identifier
      }
    });

    if (authError) {
      if (authError.message.includes("already registered") || authError.message.includes("already exists")) {
        return { success: false, error: "An account with this email/phone already exists. Please log in." };
      }
      throw authError;
    }

    const userId = authData.user.id;

    // 2. Sync to public tables
    const { error: syncError } = await supabaseAdmin.from('users').upsert({
      id: userId,
      name: data.name,
      phone: isEmail ? `email-${userId.slice(0, 8)}` : data.identifier,
      email: email,
      phone_verified_at: new Date().toISOString(),
      email_verified_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    if (syncError) {
      console.error("User record sync failed in registerUserAdmin:", syncError);
      return { success: false, error: `Database sync failed: ${syncError.message}` };
    }

    const { error: profileError } = await supabaseAdmin.from('profiles').upsert({
      user_id: userId,
      updated_at: new Date().toISOString()
    });

    if (profileError) {
      console.error("Profile record sync failed in registerUserAdmin:", profileError);
    }

    return { success: true, email, userId };
  } catch (error: any) {
    console.error("Admin registration failed:", error);
    return { success: false, error: error.message };
  }
}
