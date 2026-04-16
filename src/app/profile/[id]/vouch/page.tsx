import { Metadata } from "next"
import { VouchForm } from "@/components/vouching/VouchForm"

export const metadata: Metadata = {
  title: "Vouch for a Tradesperson | BuildBridge",
  description: "Vouch for a skilled worker on BuildBridge.",
}

/**
 * DEMO MODE: Auth and profile checks removed.
 * VouchForm renders with mock data.
 *
 * To re-enable Supabase:
 *   1. Import createClient from "@/lib/supabase/server"
 *   2. Restore auth.getUser(), profile fetch, and vouch duplication check
 */
export default async function VouchPage({ params }: { params: { id: string } }) {
  // Demo: Use mock data for the recipient
  const recipientProfileId = params.id || "demo-profile-001"
  const recipientName = "Demo Artisan"

  return (
    <main className="min-h-screen bg-background pt-24 pb-12">
      <VouchForm recipientProfileId={recipientProfileId} recipientName={recipientName} />
    </main>
  )
}
