import { NextRequest, NextResponse } from "next/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"
import { verifyTransaction } from "@/lib/paystack"

/**
 * POST /api/payment/verify
 *
 * Called client-side after Paystack's payment popup reports success.
 * Uses the service role key to bypass RLS since this is a trusted
 * server-side route — the Paystack signature / reference verification
 * is the security layer here.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { reference, need_id, message, tip_kobo } = body

    if (!reference || !need_id) {
      return NextResponse.json(
        { success: false, error: "Missing reference or need_id" },
        { status: 400 }
      )
    }

    // 1. Verify with Paystack — this is the primary security check
    let tx: any
    try {
      const result = await verifyTransaction(reference)
      if (!result.status || result.data.status !== "success") {
        return NextResponse.json(
          { success: false, error: "Transaction not successful on Paystack" },
          { status: 400 }
        )
      }
      tx = result.data
    } catch (err: any) {
      console.error("[verify] Paystack verify error:", err)
      return NextResponse.json(
        { success: false, error: `Paystack verification failed: ${err.message}` },
        { status: 500 }
      )
    }

    // 2. Use service role to bypass RLS for trusted server writes
    const supabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 3. Idempotency check — don't double-count if verify is called twice
    const { data: existing } = await supabase
      .from("pledges")
      .select("id")
      .eq("payment_reference", reference)
      .maybeSingle()

    if (existing) {
      console.log("[verify] Pledge already processed:", reference)
      return NextResponse.json({ success: true, note: "Already processed" }, { status: 200 })
    }

    // 4. Financial arithmetic (all in kobo)
    const totalPledgeKobo = tx.amount
    const platformFeeKobo = Math.floor(totalPledgeKobo * 0.05)
    const processingFeeKobo =
      Math.floor(totalPledgeKobo * 0.015) + (totalPledgeKobo > 250000 ? 10000 : 0)
    const tradespersonReceivesKobo = totalPledgeKobo - platformFeeKobo - processingFeeKobo

    const backerUserId = tx.metadata?.backer_user_id || "guest"

    // 5. Insert pledge record
    const { error: pledgeError } = await supabase.from("pledges").insert({
      need_id,
      backer_user_id: backerUserId,
      amount: totalPledgeKobo,
      currency: "NGN",
      fee_breakdown_json: {
        platform_fee: platformFeeKobo,
        processing_fee: processingFeeKobo,
        tradesperson_receives: tradespersonReceivesKobo,
      },
      payment_provider: "paystack",
      payment_reference: reference,
      payment_status: "completed",
      message: message?.slice(0, 500) || null,
      paid_at: new Date().toISOString(),
    })

    if (pledgeError) {
      // Unique constraint on reference = already processed
      if (pledgeError.code === "23505") {
        return NextResponse.json({ success: true, note: "Already processed" }, { status: 200 })
      }
      console.error("[verify] Pledge insert error:", pledgeError)
      return NextResponse.json(
        { success: false, error: `Database error: ${pledgeError.message}` },
        { status: 500 }
      )
    }

    // 6. Update the need's funded_amount and pledge_count
    const { data: need, error: fetchError } = await supabase
      .from("needs")
      .select("item_cost, funded_amount, pledge_count")
      .eq("id", need_id)
      .single()

    if (fetchError || !need) {
      console.error("[verify] Need fetch error:", fetchError)
      // Pledge is recorded — don't fail entirely, just log
      return NextResponse.json({ success: true, warning: "Need totals not updated" }, { status: 200 })
    }

    const newFundedAmount = (need.funded_amount || 0) + totalPledgeKobo
    const isFullyFunded = newFundedAmount >= need.item_cost

    const updateData: Record<string, any> = {
      funded_amount: newFundedAmount,
      pledge_count: (need.pledge_count || 0) + 1,
      updated_at: new Date().toISOString(),
    }

    if (isFullyFunded) {
      updateData.status = "funded"
      updateData.disbursed_at = new Date().toISOString()
    }

    const { error: updateError } = await supabase
      .from("needs")
      .update(updateData)
      .eq("id", need_id)

    if (updateError) {
      console.error("[verify] Need update error:", updateError)
      return NextResponse.json(
        { success: false, error: `Failed to update need totals: ${updateError.message}` },
        { status: 500 }
      )
    }

    console.log(
      `[verify] ✓ Pledge recorded: ${reference} | Need: ${need_id} | Amount: ${totalPledgeKobo} kobo | New total: ${newFundedAmount}`
    )

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err: any) {
    console.error("[verify] Unexpected error:", err)
    return NextResponse.json(
      { success: false, error: err.message || "Unexpected error" },
      { status: 500 }
    )
  }
}
