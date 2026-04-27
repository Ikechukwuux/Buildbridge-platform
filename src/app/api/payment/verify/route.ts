import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { verifyTransaction } from "@/lib/paystack"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { reference, need_id, message, tip_kobo } = body

    if (!reference || !need_id) {
      return NextResponse.json({ success: false, error: "Missing reference or need_id" }, { status: 400 })
    }

    // Verify with Paystack API
    let tx
    try {
      const result = await verifyTransaction(reference)
      if (!result.status || result.data.status !== "success") {
        return NextResponse.json({ success: false, error: "Transaction not successful" }, { status: 400 })
      }
      tx = result.data
    } catch (err: any) {
      console.error("Paystack verify error:", err)
      return NextResponse.json({ success: false, error: `Verification failed: ${err.message}` }, { status: 500 })
    }

    const supabase = await createClient()

    // Check for existing pledge (idempotency)
    const { data: existing } = await supabase
      .from("pledges")
      .select("id")
      .eq("payment_reference", reference)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ success: true, note: "Pledge already exists" }, { status: 200 })
    }

    const totalPledgeKobo = tx.amount
    const platformFeeKobo = Math.floor(totalPledgeKobo * 0.05)
    const processingFeeKobo = Math.floor(totalPledgeKobo * 0.015) + (totalPledgeKobo > 250000 ? 10000 : 0)
    const tradespersonReceivesKobo = totalPledgeKobo - platformFeeKobo - processingFeeKobo

    // Insert pledge
    const { error: pledgeError } = await supabase.from("pledges").insert({
      need_id,
      backer_user_id: tx.metadata?.backer_user_id || "guest",
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
      message: message || null,
      paid_at: new Date().toISOString(),
    })

    if (pledgeError) {
      if (pledgeError.code === "23505") {
        return NextResponse.json({ success: true, note: "Pledge already processed" })
      }
      throw pledgeError
    }

    // Update need
    const { data: need, error: fetchError } = await supabase
      .from("needs")
      .select("item_cost, funded_amount, pledge_count")
      .eq("id", need_id)
      .single()

    if (!fetchError && need) {
      const newFundedAmount = (need.funded_amount || 0) + totalPledgeKobo
      const isFullyFunded = newFundedAmount >= need.item_cost

      const updateData: Record<string, any> = {
        funded_amount: newFundedAmount,
        pledge_count: (need.pledge_count || 0) + 1,
        updated_at: new Date().toISOString(),
      }

      if (isFullyFunded) {
        updateData.status = "funded"
        updateData.completed_at = new Date().toISOString()
      }

      await supabase.from("needs").update(updateData).eq("id", need_id)
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err: any) {
    console.error("Payment verify route error:", err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
