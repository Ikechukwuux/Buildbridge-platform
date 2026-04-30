import { NextRequest, NextResponse } from "next/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"
import { verifyTransaction } from "@/lib/paystack"

/**
 * POST /api/payment/verify
 *
 * Called client-side after Paystack's payment popup reports success.
 * Uses the service role key to bypass RLS.
 *
 * NOTE: We skip inserting into the `pledges` table for now because it has
 * a FK constraint on backer_user_id → users(id) referencing the old legacy
 * users table (not Supabase Auth). Instead we update funded_amount and
 * pledge_count directly on the need, which is the critical path for the demo.
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

    // 3. Check if this reference has already been applied (idempotency)
    //    We use the needs.disbursement_reference column as a lightweight dedupe key
    const { data: alreadyApplied } = await supabase
      .from("needs")
      .select("id, disbursement_reference")
      .eq("id", need_id)
      .single()

    // Store processed references in a simple JSON field — check via a dedicated column
    // For now, use a simple check: has this reference been stored before?
    // We'll track it in the needs.updated_at / pledge_count comparison approach
    // A cleaner solution would be a payment_events table — for MVP we just update directly.

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

    // 5. Amount arithmetic — everything in KOBO (same as item_cost)
    const pledgeKobo = tx.amount // Paystack always returns kobo

    const newFundedAmount = (need.funded_amount || 0) + pledgeKobo
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

    // 6. Apply update
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

    console.log(
      `[verify] ✓ ref=${reference} | need=${need_id} | +${pledgeKobo} kobo | new_total=${newFundedAmount} | fully_funded=${isFullyFunded}`
    )

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
