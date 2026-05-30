import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import crypto from "crypto"

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { type, documentId } = await req.json()

    if (!type || !['nin', 'bvn'].includes(type) || !documentId) {
      return NextResponse.json({ error: "Invalid request parameters" }, { status: 400 })
    }

    // Strict 11-digit regex validation for NIN/BVN
    if (!/^\d{11}$/.test(documentId)) {
      return NextResponse.json({ error: "Invalid format. Must be exactly 11 digits." }, { status: 400 })
    }

    // Fetch user profile ID
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, badge_level')
      .eq('user_id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    const salt = process.env.IDENTITY_SALT
    if (!salt) {
      console.error("IDENTITY_SALT env var is not set")
      return NextResponse.json({ error: "Server configuration error." }, { status: 500 })
    }
    const generatedHash = crypto.createHash('sha256').update(documentId + salt).digest('hex')

    const provider = "manual"

    // Insert verification tracking record with pending admin review
    const { error: insertError } = await supabase
       .from('verifications')
       .upsert({
          profile_id: profile.id,
          [type === 'nin' ? 'nin_hash' : 'bvn_hash']: generatedHash,
          [type === 'nin' ? 'nin_verified_at' : 'bvn_verified_at']: null, // Set after admin approval
          provider: provider,
          verified: false,
          manual_review_required: true,
          manual_review_completed: false,
       }, {
          onConflict: 'profile_id'
       })

    if (insertError) {
      // Check for unique key violation (meaning this NIN is already used)
      if (insertError.code === '23505') {
         return NextResponse.json({ error: "This identity document is already registered to another user." }, { status: 409 })
      }
      console.error(insertError)
      return NextResponse.json({ error: "Failed to store verification securely." }, { status: 500 })
    }

    // Badge upgrade happens when admin approves the verification

    return NextResponse.json({ success: true, message: "Identity submitted for review. You'll be notified once verified." })

  } catch (err: any) {
    console.error("Identity Verification Error", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
