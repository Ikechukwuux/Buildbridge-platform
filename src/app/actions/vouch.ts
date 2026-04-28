"use server"

import { createClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { Redis } from "@upstash/redis"

const redis = (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null

function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return null
  }

  return createAdminClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })
}

export async function submitVouchAction(formData: FormData) {
  try {
    const recipientProfileId = formData.get("recipient_profile_id") as string
    const statement = formData.get("statement") as string
    const voucherName = formData.get("voucher_name") as string
    const voucherPhone = formData.get("voucher_phone") as string

    console.log("[vouch] Received:", { recipientProfileId, statementLen: statement?.length, voucherName })

    if (!recipientProfileId || !statement) {
      return { success: false, error: "Missing required fields." }
    }

    if (statement.length < 20 || statement.length > 300) {
      return { success: false, error: "Vouch statement must be between 20 and 300 characters." }
    }

    // Rate limit by IP (1 vouch per 5 minutes per IP)
    const headersList = await headers()
    const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    if (redis) {
      const key = `vouch:ratelimit:${ip}`
      const existing = await redis.get(key)
      if (existing) {
        return { success: false, error: "Please wait before submitting another vouch." }
      }
      await redis.set(key, "1", { ex: 300 })
    }

    // Admin client (bypasses RLS for all operations)
    const supabaseAdmin = getAdminClient()
    console.log("[vouch] Admin client:", supabaseAdmin ? "created" : "NULL")
    if (!supabaseAdmin) {
      return { success: false, error: "Server configuration error." }
    }

    // Check authentication (for self-vouch and dedup)
    const supabase = await createClient()
    const { data: { user } } = supabase
      ? await supabase.auth.getUser()
      : { data: { user: null } }

    let voucherUserId: string | null = null
    let finalVoucherName: string | null = null

    if (user) {
      voucherUserId = user.id
      finalVoucherName = user.user_metadata?.name || user.email || null
    } else {
      if (!voucherName || voucherName.trim().length < 2) {
        return { success: false, error: "Please provide your name." }
      }
      finalVoucherName = voucherName.trim()
    }

    // Verify recipient profile exists (admin client — bypasses RLS)
    const { data: recipientExists, error: profileCheckError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', recipientProfileId)
      .maybeSingle()

    if (profileCheckError) {
      console.error("[vouch] Profile lookup error:", profileCheckError)
      return { success: false, error: "Tradesperson profile not found." }
    }
    if (!recipientExists) {
      console.error("[vouch] Profile not found for ID:", recipientProfileId)
      return { success: false, error: "Tradesperson profile not found." }
    }

    // Self-vouch check (authenticated only)
    if (voucherUserId) {
      const { data: voucherProfile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('user_id', voucherUserId)
        .single()

      if (voucherProfile?.id === recipientProfileId) {
        return { success: false, error: "You cannot vouch for yourself." }
      }
    }

    // Duplicate check
    if (voucherUserId) {
      const { data: existing } = await supabaseAdmin
        .from('vouches')
        .select('id')
        .eq('voucher_user_id', voucherUserId)
        .eq('recipient_profile_id', recipientProfileId)
        .maybeSingle()

      if (existing) {
        return { success: false, error: "You have already vouched for this tradesperson." }
      }
    } else if (voucherPhone) {
      const { data: existing } = await supabaseAdmin
        .from('vouches')
        .select('id')
        .eq('voucher_phone', voucherPhone)
        .eq('recipient_profile_id', recipientProfileId)
        .maybeSingle()

      if (existing) {
        return { success: false, error: "You have already vouched for this tradesperson." }
      }
    }

    // Insert vouch
    const { error: insertError } = await supabaseAdmin
      .from('vouches')
      .insert({
        voucher_user_id: voucherUserId,
        recipient_profile_id: recipientProfileId,
        statement: statement.trim(),
        voucher_name: finalVoucherName,
        voucher_phone: voucherPhone?.trim() || null,
      })

    if (insertError) {
      console.error("Vouch insert error:", insertError)
      return { success: false, error: `Failed to submit vouch. ${insertError.message || ''}` }
    }

    // Recalculate recipient badge: if vouch_count reaches 3, promote to Level 1
    const { data: recipientProfile } = await supabaseAdmin
      .from('profiles')
      .select('id, badge_level, vouch_count')
      .eq('id', recipientProfileId)
      .single()

    if (recipientProfile) {
      const newCount = (recipientProfile.vouch_count || 0) + 1
      let newLevel = recipientProfile.badge_level

      if (newLevel === 'level_0_unverified' && newCount >= 3) {
        newLevel = 'level_1_community_member'
      }

      await supabaseAdmin
        .from('profiles')
        .update({
          vouch_count: newCount,
          badge_level: newLevel
        })
        .eq('id', recipientProfileId)
    }

    revalidatePath(`/profile/${recipientProfileId}`)
    return { success: true }

  } catch (err: any) {
    console.error("Vouch Action Error:", err)
    return { success: false, error: err.message || "An unexpected error occurred." }
  }
}
