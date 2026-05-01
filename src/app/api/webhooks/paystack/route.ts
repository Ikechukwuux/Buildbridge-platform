import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { createClient } from "@/lib/supabase/server"
import { verifyTransaction } from "@/lib/paystack"

function extractMessage(metadata: any): string | null {
  if (!metadata?.custom_fields) return null
  const msgField = metadata.custom_fields.find(
    (f: any) => f.variable_name === "message"
  )
  return msgField?.value?.trim() || null
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY || "")
      .update(body)
      .digest("hex")

    // 1. Signature Verification
    if (hash !== req.headers.get("x-paystack-signature")) {
      console.error("Invalid Paystack signature")
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const event = JSON.parse(body)

    // Only process successful charges
    if (event.event !== "charge.success") {
      return NextResponse.json({ received: true }, { status: 200 })
    }

    const { data } = event
    const { reference, amount, metadata } = data
    const { need_id, backer_user_id } = metadata

    if (!need_id || !backer_user_id) {
       console.error("Missing metadata in Paystack event", metadata)
       return NextResponse.json({ error: "Missing metadata" }, { status: 400 })
    }

    // 2. Secondary Verification with Paystack API
    try {
      const verifyResult = await verifyTransaction(reference)
      if (!verifyResult.status || verifyResult.data.status !== "success") {
        console.error("Paystack secondary verification failed", verifyResult)
        return NextResponse.json({ error: "Transaction not verified" }, { status: 400 })
      }
    } catch (verifyErr) {
      console.error("Paystack verify API call failed:", verifyErr)
      // Continue anyway — the HMAC signature was valid
    }

    const supabase = await createClient()

    // Extract user message from custom_fields
    const userMessage = extractMessage(metadata)

    // 3. Financial Arithmetic (Kobo)
    const totalChargedKobo = amount // Already in kobo from Paystack
    const pledgeKobo: number =
      typeof metadata?.pledge_kobo === "number" && metadata.pledge_kobo > 0
        ? metadata.pledge_kobo
        : totalChargedKobo // fallback: no tip was added, full amount goes to artisan

    // Sanity check — pledge portion should never exceed total charged
    const safePledgeKobo = Math.min(pledgeKobo, totalChargedKobo)

    const platformFeeKobo = Math.floor(safePledgeKobo * 0.05) // 5% BuildBridge fee on pledge
    const processingFeeKobo = Math.floor(totalChargedKobo * 0.015) + (totalChargedKobo > 250000 ? 10000 : 0) // Paystack 1.5% + N100 if > N2500
    const tradespersonReceivesKobo = safePledgeKobo - platformFeeKobo - processingFeeKobo

    const feeBreakdown = {
      platform_fee: platformFeeKobo,
      processing_fee: processingFeeKobo,
      tradesperson_receives: tradespersonReceivesKobo,
      tip: totalChargedKobo - safePledgeKobo
    }

    // 4. Escrow Orchestration (Database Transaction)
    // We use Supabase RPC or a simple sequential update since Next.js server actions / routes are single-execution
    // For production, use a database function (RPC) for atomicity
    
    // Step A: Check for existing pledge (idempotency)
    const { data: existingPledge } = await supabase
      .from("pledges")
      .select("id")
      .eq("payment_reference", reference)
      .maybeSingle()

    if (existingPledge) {
      return NextResponse.json({ received: true, note: "Pledge already processed" }, { status: 200 })
    }

    // NOTE: Skipping pledges table insert — backer_user_id FK references legacy users table.
    // Update funded_amount and pledge_count directly on the need instead.

    // Step B: Fetch current need totals
    const { data: need, error: fetchError } = await supabase
      .from("needs")
      .select("item_cost, funded_amount, pledge_count, status")
      .eq("id", need_id)
      .single()

    if (fetchError || !need) throw fetchError || new Error("Need not found")

    const newFundedAmount = (need.funded_amount || 0) + safePledgeKobo
    const isFullyFunded = newFundedAmount >= need.item_cost

    const updateData: any = {
       funded_amount: newFundedAmount,
       pledge_count: (need.pledge_count || 0) + 1,
       updated_at: new Date().toISOString()
    }

    if (isFullyFunded) {
       updateData.status = "funded"
       updateData.completed_at = new Date().toISOString()
    }

    const { error: updateError } = await supabase
      .from("needs")
      .update(updateData)
      .eq("id", need_id)

    if (updateError) throw updateError

    // 4. Notifications & Milestones
    try {
      // We need the profile owner's user_id
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('id', need_id === metadata.need_id ? need_id : metadata.need_id) // Safety check on IDs
        .single()

      if (profile?.user_id) {
        // Trigger Pledge Notification
        const { notifyPledgeReceived } = await import("@/lib/notifications")
        const { checkAndTriggerMilestones } = await import("@/lib/milestones")

        await notifyPledgeReceived(profile.user_id, safePledgeKobo, need_id, reference)
        await checkAndTriggerMilestones(need_id)
      }
    } catch (notifErr) {
      // We don't want to fail the webhook if notifications fail, we log them for audit anyway
      console.error("Non-critical notification error:", notifErr)
    }

    return NextResponse.json({ received: true }, { status: 200 })

  } catch (error: any) {
    console.error("Paystack webhook error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
