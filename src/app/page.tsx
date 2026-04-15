import { Metadata } from "next"
import { Hero } from "@/components/home/Hero"
import { FeaturedNeeds } from "@/components/home/FeaturedNeeds"
import { HowItWorks } from "@/components/home/HowItWorks"
import { PartnerLogos } from "@/components/home/PartnerLogos"
import { CoreValues } from "@/components/home/CoreValues"
import { ImpactHighlights } from "@/components/home/ImpactHighlights"
import { ImpactTeaser } from "@/components/home/ImpactTeaser"
import { FinalCTA } from "@/components/home/FinalCTA"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "BuildBridge | Empower Change with Every Support",
  description: "Direct investment in African skilled trades. Connect with verified tradespeople and fund their equipment needs with zero interest.",
}

// Mock stats for immediate visual fidelity
const MOCK_STATS = {
  totalFunded: 45200000, // 45.2M kobo = 452k Naira (example)
  totalTradespeople: 1284,
}

export default async function Home() {
  const supabase = await createClient()

  // Fetch Featured Needs (limit 3, ordered by urgency/created_at)
  const { data: needs } = await supabase
    .from("needs")
    .select("*, profile:profiles(name, location_lga, location_state, trade_category, badge_level, vouch_count, photo_url)")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(3)

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      <Hero stats={MOCK_STATS} />
      
      <PartnerLogos />

      <CoreValues />

      <ImpactHighlights />
      
      {/* Passing empty array if null to trigger EmptyState in component */}
      <FeaturedNeeds needs={needs || []} />
      
      <HowItWorks />
      
      <ImpactTeaser />
      
      <FinalCTA />
    </div>
  )
}
