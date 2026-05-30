import { NextRequest, NextResponse } from "next/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"
import { verifyTransaction } from "@/lib/paystack"
import { RateLimiters, enforceRateLimit, getClientIp } from "@/lib/rate-limit"

/**
 * POST /api/payment/verify
 *
 * Called client-side after Paystack's payment popup reports success.
 * Uses the service role key to bypass RLS.
 */
export async function POST(req: NextRequest) {
  try {
    // Rate-limit per IP: 5 payment confirmations / minute
    const limited = await enforceRateLimit(RateLimiters.payment(), getClientIp(req))
    if (limited) return limited

    const body = await req.json()
    const { reference, need_id, message, fee_kobo } = body

    if (!reference || !need_id) {
      return NextResponse.json(
        { success: false, error: "Missing reference or need_id" },
        { status: 400 }
      )
    }

    // 1. Verify with Paystack — primary security check
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

    // 2. Service role client — bypasses RLS
    const supabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 3. Idempotency — reject if this reference was already processed
    const { data: existingPledge } = await supabase
      .from("pledges")
      .select("id")
      .eq("payment_reference", reference)
      .maybeSingle()

    if (existingPledge) {
      const { data: need } = await supabase
        .from("needs")
        .select("funded_amount, pledge_count")
        .eq("id", need_id)
        .single()
      return NextResponse.json({
        success: true,
        funded_amount: need?.funded_amount ?? 0,
        pledge_count: need?.pledge_count ?? 0,
        is_fully_funded: (need?.funded_amount ?? 0) >= (need?.funded_amount ?? 1),
        note: "Already processed",
      })
    }

    // 4. Fetch the current need to compute new totals
    const { data: need, error: fetchError } = await supabase
      .from("needs")
      .select("id, item_cost, funded_amount, pledge_count, status")
      .eq("id", need_id)
      .single()

    if (fetchError || !need) {
      console.error("[verify] Need fetch error:", fetchError)
      return NextResponse.json(
        { success: false, error: "Need not found" },
        { status: 404 }
      )
    }

    // 5. Amount arithmetic
    // tx.amount = total charged by Paystack (full pledge)
    // tx.metadata.pledge_kobo = artisan's portion (97% after 3% platform fee)
    // We only credit the artisan's portion to funded_amount.
    const totalChargedKobo = tx.amount
    const pledgeKobo: number =
      typeof tx.metadata?.pledge_kobo === "number" && tx.metadata.pledge_kobo > 0
        ? tx.metadata.pledge_kobo
        : totalChargedKobo - Math.floor(totalChargedKobo * 0.03) // fallback: derive 97% if metadata missing

    // Sanity check — pledge portion should never exceed total charged
    const safePledgeKobo = Math.min(pledgeKobo, totalChargedKobo)

    const newFundedAmount = (need.funded_amount || 0) + safePledgeKobo
    const isFullyFunded = newFundedAmount >= need.item_cost

    const updateData: Record<string, any> = {
      funded_amount: newFundedAmount,
      pledge_count: (need.pledge_count || 0) + 1,
      updated_at: new Date().toISOString(),
    }

    if (isFullyFunded && need.status !== "funded" && need.status !== "completed") {
      updateData.status = "funded"
      updateData.disbursed_at = new Date().toISOString()
    }

    // 6. Apply need update
    const { error: updateError } = await supabase
      .from("needs")
      .update(updateData)
      .eq("id", need_id)

    if (updateError) {
      console.error("[verify] Need update error:", updateError)
      return NextResponse.json(
        { success: false, error: `Failed to update need: ${updateError.message}` },
        { status: 500 }
      )
    }

    // 7. Record pledge (backer may be anonymous — backer_user_id is nullable)
    const platformFeeKobo = totalChargedKobo - safePledgeKobo
    const processingFeeKobo = Math.floor(totalChargedKobo * 0.015) + (totalChargedKobo > 250000 ? 10000 : 0)
    await supabase.from("pledges").insert({
      need_id,
      backer_user_id: tx.metadata?.backer_user_id || null,
      amount: safePledgeKobo,
      currency: "NGN",
      fee_breakdown_json: {
        platform_fee: platformFeeKobo,
        processing_fee: processingFeeKobo,
        tradesperson_receives: safePledgeKobo - processingFeeKobo,
      },
      payment_provider: "paystack",
      payment_reference: reference,
      payment_status: "completed",
      paid_at: new Date().toISOString(),
      message: message || null,
    })

    return NextResponse.json({
      success: true,
      funded_amount: newFundedAmount,
      pledge_count: updateData.pledge_count,
      is_fully_funded: isFullyFunded,
    })
  } catch (err: any) {
    console.error("[verify] Unexpected error:", err)
    return NextResponse.json(
      { success: false, error: err.message || "Unexpected server error" },
      { status: 500 }
    )
  }
}
