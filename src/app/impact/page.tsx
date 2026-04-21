import * as React from "react"
import { ImpactGrid } from "@/components/impact/ImpactGrid"
import { BadgeDisplay } from "@/components/ui/BadgeDisplay"
import { ImpactHero } from "@/components/impact/ImpactHero"
import { ImpactCTA } from "@/components/impact/ImpactCTA"

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
      badge_level: "level_4_platform_verified",
      photo_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200",
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
      badge_level: "level_3_established",
      photo_url: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=200",
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
      badge_level: "level_4_platform_verified",
      photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    },
    published_at: new Date().toISOString()
  },
  {
    id: "mock-4",
    photo_url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800",
    caption: "My salon now serves 40 clients daily, up from 12. The dryer stations changed everything for my business.",
    profile: {
      name: "Grace N.",
      trade_category: "hair_styling",
      location_lga: "Ikeja",
      location_state: "Lagos",
      badge_level: "level_2_trusted_tradesperson",
      photo_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
    },
    published_at: new Date().toISOString()
  },
  {
    id: "mock-5",
    photo_url: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&q=80&w=800",
    caption: "From a roadside oven to a proper bakery. Now I supply bread to three communities and employ two helpers.",
    profile: {
      name: "Fatima B.",
      trade_category: "baking",
      location_lga: "Kano Municipal",
      location_state: "Kano",
      badge_level: "level_3_established",
      photo_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    },
    published_at: new Date().toISOString()
  }
];

export default async function ImpactPage() {
  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      <ImpactHero count={MOCK_SUBMISSIONS.length} />

      {/* Impact Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--color-surface-container-low)' }}>
        <div className="max-w-7xl mx-auto">
          <ImpactGrid submissions={(MOCK_SUBMISSIONS as any) || []} />
        </div>
      </section>

      {/* Trust Ladder Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ background: 'var(--color-surface)' }}>
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 rounded-full opacity-[0.05]" style={{ background: 'var(--color-primary)', filter: 'blur(80px)' }} />
        <div className="max-w-7xl mx-auto">
          <BadgeDisplay />
        </div>
      </section>

      <ImpactCTA />
    </div>
  )
}
