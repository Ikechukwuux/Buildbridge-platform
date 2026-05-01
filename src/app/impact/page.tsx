import * as React from "react"
import { ImpactGrid } from "@/components/impact/ImpactGrid"
import { BadgeDisplay } from "@/components/ui/BadgeDisplay"
import { ImpactHero } from "@/components/impact/ImpactHero"
import { ImpactCTA } from "@/components/impact/ImpactCTA"
import { IMPACT_STORIES } from "@/lib/impact-stories"
import { createClient } from "@/lib/supabase/server"
import { getCachedData } from "@/lib/redis"

export const metadata = {
  title: "The Impact Wall | BuildBridge Success Stories",
  description: "Witness the power of community-backed growth. See real stories of Nigerian tradespeople reaching their potential.",
}

export default async function ImpactPage() {
  // Fetch real submissions from the database using Redis cache (30s TTL)
  let dbSubmissions: any[] = []
  try {
    const data = await getCachedData(
      'impact:submissions:feed',
      async () => {
        console.log("Fetching impact wall submissions from Supabase...")
        const supabase = await createClient()
        const { data, error } = await supabase
          .from('impact_wall_submissions')
          .select(`
            id,
            caption,
            photo_url,
            video_url,
            opted_in_at,
            moderation_status,
            published_at,
            need_id,
            profile_id,
            profiles:profile_id (
              id,
              full_name,
              trade_category,
              location_lga,
              location_state,
              badge_level,
              photo_url,
              years_experience
            ),
            needs:need_id (
              item_name,
              funded_amount,
              pledge_count,
              proof_photo_url
            )
          `)
          .order('opted_in_at', { ascending: false })

        if (error) throw error;
        return data || []
      },
      30 // Cache for 30 seconds
    )

    if (data && data.length > 0) {
      // Include all submissions (pending and approved) so users see their own right away
      dbSubmissions = data.map((sub: any) => ({
        id: sub.id,
        photo_url: sub.photo_url || sub.needs?.proof_photo_url,
        caption: sub.caption,
        moderation_status: sub.moderation_status,
        published_at: sub.opted_in_at, // use opted_in_at so it shows right away
        profile: {
          name: sub.profiles?.full_name || "Verified Artisan",
          trade_category: sub.profiles?.trade_category || "other",
          location_lga: sub.profiles?.location_lga || "",
          location_state: sub.profiles?.location_state || "",
          badge_level: sub.profiles?.badge_level || "level_0_unverified",
          photo_url: sub.profiles?.photo_url || "",
          years_experience: sub.profiles?.years_experience || 0,
        }
      }))
    }
  } catch (err) {
    console.error("Could not fetch real submissions:", err)
  }
  
  console.log("DB Submissions fetched:", dbSubmissions.length);

  // Convert mock stories to the format ImpactGrid expects
  const mockSubmissions = IMPACT_STORIES.map(story => ({
    id: story.id,
    photo_url: story.photo_url,
    caption: story.caption,
    moderation_status: 'approved' as const,
    profile: story.profile,
    published_at: story.published_at,
  }))

  // Real submissions first, then mock ones as padding
  const allSubmissions = [...dbSubmissions, ...mockSubmissions]

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      <ImpactHero count={allSubmissions.length} />

      {/* Impact Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--color-surface-container-low)' }}>
        <div className="max-w-7xl mx-auto">
          <ImpactGrid submissions={(allSubmissions as any) || []} />
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
