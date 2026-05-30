import { NextRequest, NextResponse } from "next/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/server"
import { createTransferRecipient, initiateTransfer } from "@/lib/paystack"
import crypto from "crypto"

/**
 * POST /api/payment/disburse
 *
 * Called by the admin proof-approval action. Initiates a Paystack Transfer
 * to the artisan's registered bank account.
 *
 * Body: { need_id: string }
 *
 * Flow:
 *  1. Verify caller is admin (app_metadata.role === 'admin')
 *  2. Fetch need → profile → bank account details
 *  3. Create or reuse Paystack Transfer Recipient
 *  4. Initiate transfer for the need's funded_amount
 *  5. Mark need as completed + record transfer reference
 */
export async function POST(req: NextRequest) {
  try {
    const userClient = await createClient()
    if (!userClient) return NextResponse.json({ error: "Service unavailable" }, { status: 503 })

    const { data: { user } } = await userClient.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    if (user.app_metadata?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { need_id } = await req.json()
    if (!need_id) return NextResponse.json({ error: "need_id required" }, { status: 400 })

    const supabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 1. Fetch need + profile bank details
    const { data: need, error: needErr } = await supabase
      .from("needs")
      .select(`
        id, item_name, funded_amount, status, disbursed_at, transfer_reference,
        profiles:profile_id (
          id, full_name,
          bank_account_number, bank_code, bank_name, paystack_recipient_code
        )
      `)
      .eq("id", need_id)
      .single()

    if (needErr || !need) {
      return NextResponse.json({ error: "Need not found" }, { status: 404 })
    }

    if (need.disbursed_at || need.transfer_reference) {
      return NextResponse.json({ error: "Already disbursed" }, { status: 409 })
    }

    if (need.status !== "funded" && need.status !== "completed") {
      return NextResponse.json({ error: "Need is not in funded/completed state" }, { status: 400 })
    }

    const profile = Array.isArray(need.profiles) ? need.profiles[0] : need.profiles as any
    if (!profile?.bank_account_number || !profile?.bank_code) {
      return NextResponse.json(
        { error: "Artisan has not added bank account details. Ask them to add bank details in their dashboard before disbursing." },
        { status: 422 }
      )
    }

    // 2. Create or reuse Paystack recipient
    let recipientCode = profile.paystack_recipient_code
    if (!recipientCode) {
      const recipientRes = await createTransferRecipient({
        name: profile.full_name || "Artisan",
        account_number: profile.bank_account_number,
        bank_code: profile.bank_code,
      })
      if (!recipientRes.status) {
        throw new Error(`Failed to create transfer recipient: ${recipientRes.message}`)
      }
      recipientCode = recipientRes.data.recipient_code

      // Cache the recipient code on the profile to avoid recreating
      await supabase
        .from("profiles")
        .update({ paystack_recipient_code: recipientCode })
        .eq("id", profile.id)
    }

    // 3. Initiate transfer (amount is in kobo)
    const transferRef = `bb-disburse-${need_id.slice(0, 8)}-${crypto.randomBytes(4).toString("hex")}`
    const transferRes = await initiateTransfer({
      amount: Math.floor(need.funded_amount),
      recipient: recipientCode,
      reason: `BuildBridge disbursement: ${need.item_name}`,
      reference: transferRef,
    })

    if (!transferRes.status) {
      throw new Error(`Transfer initiation failed: ${transferRes.message}`)
    }

    // 4. Mark need as completed + record transfer
    const { error: updateErr } = await supabase
      .from("needs")
      .update({
        status: "completed",
        disbursed_at: new Date().toISOString(),
        disbursement_amount: need.funded_amount,
        disbursement_reference: transferRes.data.transfer_code,
        transfer_reference: transferRef,
        completed_at: new Date().toISOString(),
        moderated_by: user.id,
        moderated_at: new Date().toISOString(),
      })
      .eq("id", need_id)

    if (updateErr) throw updateErr

    return NextResponse.json({
      success: true,
      transfer_code: transferRes.data.transfer_code,
      transfer_status: transferRes.data.status,
      amount_kobo: need.funded_amount,
    })
  } catch (err: any) {
    console.error("[disburse] Error:", err)
    return NextResponse.json({ error: err.message || "Unexpected error" }, { status: 500 })
  }
}
