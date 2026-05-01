"use server"

import { createClient } from "@/lib/supabase/server"
import { getCachedData } from "@/lib/redis"

export async function getNeeds() {
  const REDIS_KEY = 'browse:needs:active'
  const TTL_SECONDS = 60 // Cache for 60 seconds

  return getCachedData(
    REDIS_KEY,
    async () => {
      console.log("Fetching active needs from Supabase...")
      const supabase = await createClient()
      
      const { data, error } = await supabase
        .from('needs')
        .select(`
          *,
          profiles:profile_id (
            id,
            full_name,
            trade_category,
            location_lga,
            location_state,
            badge_level,
            photo_url,
            vouch_count
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (error) {
        console.error("Failed to fetch real needs:", error)
        throw new Error("Failed to fetch needs")
      }

      // Map profiles locally so we can safely pass to client
      if (data) {
        return data.map((n: any) => ({
          ...n,
          _isReal: true, // tag so we can rank them higher
          profile: n.profiles ? {
            ...n.profiles,
            name: n.profiles.full_name,
          } : undefined,
        }))
      }

      return []
    },
    TTL_SECONDS
  )
}
