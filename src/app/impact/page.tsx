import * as React from "react"
import { ImpactGrid } from "@/components/impact/ImpactGrid"
import { BadgeDisplay } from "@/components/ui/BadgeDisplay"
import { Sparkles } from "lucide-react"

export const metadata = {
  title: "The Impact Wall | BuildBridge Success Stories",
  description: "Witness the power of community-backed growth. See real stories of Nigerian tradespeople reaching their potential.",
}

/**
 * DEMO MODE: Uses mock data directly instead of Supabase query.
 *
 * To re-enable Supabase:
 *   1. Import createClient from "@/lib/supabase/server"
 *   2. Restore the supabase.from('impact_wall_submissions').select(...) query
 */

// Rich mock data for the Impact Wall
const MOCK_SUBMISSIONS = [
  {
    id: "mock-1",
    photo_url: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800",
    caption: "The industrial welding machine transformed my output. I can now take on three times as many projects.",
    profile: {
      name: "Ibrahim S.",
      trade_category: "welding",
      location_lga: "Kano",
      location_state: "Kano",
      badge_level: "level_4_platform_verified"
    },
    published_at: new Date().toISOString()
  },
  {
    id: "mock-2",
    photo_url: "https://images.unsplash.com/photo-1558223932-901848bc4e92?auto=format&fit=crop&q=80&w=800",
    caption: "I moved from one machine to a full sewing workshop. BuildBridge backers made my shop ownership possible.",
    profile: {
      name: "Amina J.",
      trade_category: "fashion",
      location_lga: "Lekki",
      location_state: "Lagos",
      badge_level: "level_3_established"
    },
    published_at: new Date().toISOString()
  },
  {
    id: "mock-3",
    photo_url: "https://images.unsplash.com/photo-1536412597336-ade7b523ec3f?auto=format&fit=crop&q=80&w=800",
    caption: "With my new precision planer, I am finishing furniture sets in half the time with zero waste.",
    profile: {
      name: "Chidi O.",
      trade_category: "woodwork",
      location_lga: "Enugu",
      location_state: "Enugu",
      badge_level: "level_4_platform_verified"
    },
    published_at: new Date().toISOString()
  }
];

export default async function ImpactPage() {
  return (
    <main className="min-h-screen bg-background pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center gap-6">
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-label-large font-black uppercase tracking-widest animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Sparkles className="h-4 w-4" />
              Direct Community Result
           </div>
           <h1 className="text-display-small sm:text-display-medium lg:text-display-large font-black text-on-surface max-w-4xl tracking-tight leading-[1.1]">
              The <span className="text-primary italic">Impact</span> Wall.
           </h1>
           <p className="text-body-large text-on-surface-variant max-w-2xl leading-relaxed">
              BuildBridge is more than just funding—it's transformation. Witness the real results of backer-powered growth in local Nigerian trade across the nation.
           </p>
        </div>

        {/* The Grid Component — using mock data directly */}
        <ImpactGrid submissions={(MOCK_SUBMISSIONS as any) || []} />

        {/* Global Reference Area */}
        <div className="mt-20 pt-20 border-t border-outline-variant flex flex-col gap-12">
            <div className="text-center flex flex-col gap-2">
                <h2 className="text-headline-large font-black text-on-surface">Verified Excellence</h2>
                <p className="text-body-medium text-on-surface-variant">Every person on this wall has been verified across multiple trust tiers.</p>
            </div>
            <BadgeDisplay />
        </div>

      </div>
    </main>
  )
}
