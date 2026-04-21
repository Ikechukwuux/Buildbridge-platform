import * as React from "react"
import { ImpactGrid } from "@/components/impact/ImpactGrid"
import { BadgeDisplay } from "@/components/ui/BadgeDisplay"
import { ImpactHero } from "@/components/impact/ImpactHero"
import { ImpactCTA } from "@/components/impact/ImpactCTA"
import { IMPACT_STORIES } from "@/lib/impact-stories"

export const metadata = {
  title: "The Impact Wall | BuildBridge Success Stories",
  description: "Witness the power of community-backed growth. See real stories of Nigerian tradespeople reaching their potential.",
}

export default async function ImpactPage() {
  // Convert stories to the format ImpactGrid expects
  const submissions = IMPACT_STORIES.map(story => ({
    id: story.id,
    photo_url: story.photo_url,
    caption: story.caption,
    profile: story.profile,
    published_at: story.published_at,
  }))

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      <ImpactHero count={IMPACT_STORIES.length} />

      {/* Impact Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--color-surface-container-low)' }}>
        <div className="max-w-7xl mx-auto">
          <ImpactGrid submissions={(submissions as any) || []} />
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
