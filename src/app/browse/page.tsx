"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { NeedCard, NeedCardSkeleton } from "@/components/ui/NeedCard"
import { EmptyState } from "@/components/ui/EmptyState"
import { BrowseFilters } from "@/components/browse/BrowseFilters"
import { BrowseSort, type SortOption } from "@/components/browse/BrowseSort"
import { Search, MapPin, Sparkles, ArrowRight, X } from "lucide-react"
import Link from "next/link"

/**
 * DEMO MODE: Uses mock needs data with client-side filtering/sorting.
 * No Supabase queries.
 *
 * To re-enable Supabase:
 *   1. Import createClient from "@/lib/supabase/client"
 *   2. Restore the Supabase query builder in fetchNeeds
 */

// Rich mock needs for the browse page
const MOCK_BROWSE_NEEDS = [
  {
    id: "demo-browse-001",
    item_name: "Industrial Overlock Machine",
    item_cost: 35000000,
    funded_amount: 21500000,
    funding_percentage: 61,
    pledge_count: 14,
    status: "active",
    photo_url: "/images/profiles/amina_profile_1776774856536.png",
    story: "I need an overlock machine to take on more uniform contracts.",
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    profile: {
      name: "Amina S.",
      location_lga: "Surulere",
      location_state: "lagos",
      trade_category: "tailor",
      badge_level: "level_3_established",
      vouch_count: 8,
      photo_url: "/images/profiles/amina_profile_1776774856536.png",
    },
  },
  {
    id: "demo-browse-002",
    item_name: "Precision Wood Planer",
    item_cost: 52000000,
    funded_amount: 39000000,
    funding_percentage: 75,
    pledge_count: 22,
    status: "active",
    photo_url: "/images/profiles/chidi_profile_1776774911497.png",
    story: "A planer to finish furniture sets in half the time.",
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    profile: {
      name: "Chidi O.",
      location_lga: "Enugu North",
      location_state: "enugu",
      trade_category: "carpenter",
      badge_level: "level_4_platform_verified",
      vouch_count: 15,
      photo_url: "/images/profiles/chidi_profile_1776774911497.png",
    },
  },
  {
    id: "demo-browse-003",
    item_name: "Commercial Baking Oven",
    item_cost: 28000000,
    funded_amount: 8400000,
    funding_percentage: 30,
    pledge_count: 7,
    status: "active",
    photo_url: "/images/profiles/fatima_profile_1776775065422.png",
    story: "A new oven to serve 3 communities and hire 2 more hands.",
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    profile: {
      name: "Fatima B.",
      location_lga: "Kano Municipal",
      location_state: "kano",
      trade_category: "baker",
      badge_level: "level_2_trusted_tradesperson",
      vouch_count: 5,
      photo_url: "/images/profiles/fatima_profile_1776775065422.png",
    },
  },
  {
    id: "demo-browse-004",
    item_name: "TIG Welding Machine",
    item_cost: 45000000,
    funded_amount: 31500000,
    funding_percentage: 70,
    pledge_count: 19,
    status: "active",
    photo_url: "/images/profiles/ibrahim_profile_1776774679869.png",
    story: "Upgrade from arc welding to TIG for precision metalwork contracts.",
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    profile: {
      name: "Ibrahim K.",
      location_lga: "Wuse",
      location_state: "abuja",
      trade_category: "welder",
      badge_level: "level_3_established",
      vouch_count: 11,
      photo_url: "/images/profiles/ibrahim_profile_1776774679869.png",
    },
  },
  {
    id: "demo-browse-005",
    item_name: "Professional Hair Dryer Station",
    item_cost: 18000000,
    funded_amount: 14400000,
    funding_percentage: 80,
    pledge_count: 12,
    status: "active",
    photo_url: "/images/profiles/grace_profile_1776775079641.png",
    story: "A professional dryer station to reduce wait times and serve more clients.",
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    profile: {
      name: "Grace N.",
      location_lga: "Ikeja",
      location_state: "lagos",
      trade_category: "hair_stylist",
      badge_level: "level_2_trusted_tradesperson",
      vouch_count: 6,
      photo_url: "/images/profiles/grace_profile_1776775079641.png",
    },
  },
  {
    id: "demo-browse-006",
    item_name: "Industrial Pipe Threading Set",
    item_cost: 22000000,
    funded_amount: 5500000,
    funding_percentage: 25,
    pledge_count: 4,
    status: "active",
    photo_url: "/images/profiles/emeka_profile_1776775102118.png",
    story: "Threading set for taking on commercial plumbing contracts across the state.",
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    profile: {
      name: "Emeka A.",
      location_lga: "Port Harcourt",
      location_state: "rivers",
      trade_category: "plumber",
      badge_level: "level_1_community_member",
      vouch_count: 3,
      photo_url: "/images/profiles/emeka_profile_1776775102118.png",
    },
  },
]

export default function BrowsePage() {
  // State for needs
  const [needs, setNeeds] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  
  // State for filters
  const [filters, setFilters] = React.useState({
    category: null as string | null,
    state: null as string | null,
    badgeLevel: null as number | null,
    search: ""
  })
  
  // State for sorting
  const [sort, setSort] = React.useState<SortOption>('urgent')

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = React.useState("")
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
        setDebouncedSearch(filters.search)
    }, 500)
    return () => clearTimeout(timer)
  }, [filters.search])

  // Check if any filter is active
  const hasActiveFilters = filters.category !== null || filters.state !== null || filters.badgeLevel !== null || debouncedSearch !== ""

  const clearAllFilters = () => {
    setFilters({ category: null, state: null, badgeLevel: null, search: "" })
  }

  // Client-side filtering & sorting of mock data
  const fetchNeeds = React.useCallback(async () => {
    setLoading(true)
    
    // Simulate network delay for visual fidelity
    await new Promise(resolve => setTimeout(resolve, 500))
    
    let filtered = [...MOCK_BROWSE_NEEDS]

    // Apply Filters
    if (filters.category) {
      filtered = filtered.filter(n => n.profile.trade_category === filters.category)
    }
    if (filters.state) {
      filtered = filtered.filter(n => n.profile.location_state === filters.state.toLowerCase())
    }
    if (filters.badgeLevel !== null) {
      const levels = ['level_1_community_member', 'level_2_trusted_tradesperson', 'level_3_established', 'level_4_platform_verified']
      filtered = filtered.filter(n => n.profile.badge_level === levels[filters.badgeLevel! - 1])
    }
    if (debouncedSearch) {
      const search = debouncedSearch.toLowerCase()
      filtered = filtered.filter(n => 
        n.item_name.toLowerCase().includes(search) || 
        n.story.toLowerCase().includes(search) ||
        n.profile.name.toLowerCase().includes(search)
      )
    }

    // Apply Sorting
    switch (sort) {
      case 'urgent':
        filtered.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
        break
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case 'nearly_funded':
        filtered.sort((a, b) => b.funding_percentage - a.funding_percentage)
        break
      case 'most_pledged':
        filtered.sort((a, b) => b.funded_amount - a.funded_amount)
        break
    }

    setNeeds(filtered)
    setLoading(false)
  }, [filters.category, filters.state, filters.badgeLevel, debouncedSearch, sort])

  React.useEffect(() => {
    fetchNeeds()
  }, [fetchNeeds])

  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden">
      {/* Hero Header Band */}
      <section className="relative pt-32 pb-16 overflow-hidden" style={{ background: 'var(--color-surface)' }}>
        {/* Decorative mesh background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 -left-20 w-96 h-96 rounded-full opacity-[0.06]" style={{ background: 'var(--color-primary)', filter: 'blur(100px)' }} />
          <div className="absolute bottom-0 right-10 w-72 h-72 rounded-full opacity-[0.06]" style={{ background: 'var(--color-tertiary)', filter: 'blur(80px)' }} />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center gap-6 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest w-fit"
              style={{ background: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              {loading ? "Loading..." : `${MOCK_BROWSE_NEEDS.length} Active Needs Across Nigeria`}
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight"
              style={{ color: 'var(--color-on-surface)' }}
            >
              Discover{" "}
              <span className="text-primary italic decoration-yellow-400 underline decoration-4 underline-offset-8">
                Needs.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl font-medium max-w-3xl leading-relaxed"
              style={{ color: 'var(--color-on-surface-variant)' }}
            >
              Back verified tradespeople building their futures. Every pledge is held in escrow and only deployed once goals are reached.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-grow pb-24 px-4 sm:px-6 lg:px-8 -mt-2" style={{ background: 'var(--color-surface-container-low)' }}>
        <div className="mx-auto max-w-7xl flex flex-col gap-10 pt-10">
        
          {/* Filter Panel — Elevated Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col gap-6 p-6 md:p-8 rounded-[2rem] bg-white border border-outline-variant/30"
            style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}
          >
            <BrowseFilters onFilterChange={setFilters} activeFilters={filters} />
             
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-outline-variant/20">
              <div className="flex items-center gap-3">
                <p className="text-sm font-bold" style={{ color: 'var(--color-on-surface-variant)' }}>
                  Showing{" "}
                  <span className="text-on-surface font-black">{loading ? "..." : needs.length}</span>{" "}
                  active needs
                </p>
                {hasActiveFilters && (
                  <button 
                    onClick={clearAllFilters}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-error/10 text-error text-xs font-black uppercase tracking-widest hover:bg-error/20 transition-colors"
                  >
                    <X className="h-3 w-3" />
                    Clear All
                  </button>
                )}
              </div>
              <BrowseSort onSortChange={setSort} activeSort={sort} />
            </div>
          </motion.div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <NeedCardSkeleton key={i} />
              ))
            ) : needs.length > 0 ? (
              needs.map((need, index) => (
                <motion.div
                  key={need.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                >
                  <NeedCard need={need} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 px-4">
                 {(() => {
                   // Determine empty state type based on filters
                   if (debouncedSearch) {
                     return (
                       <EmptyState 
                         icon={Search}
                         title={`No results for '${debouncedSearch}'`}
                         description="Check the spelling or try a different word."
                         actionLabel="Clear search"
                         onAction={() => setFilters({ ...filters, search: "" })}
                         className="bg-transparent border-none"
                       />
                     );
                   } else if (filters.state) {
                     return (
                       <EmptyState 
                         icon={MapPin}
                         title="No needs in this area yet"
                         description="Know a tradesperson here who needs backing? Help them get started."
                         actionLabel="Create a Need"
                         onAction={() => window.location.href = "/onboarding"}
                         className="bg-transparent border-none"
                       />
                     );
                   } else if (filters.category || filters.badgeLevel !== null) {
                     return (
                       <EmptyState 
                         icon={Search}
                         title="No needs match your search"
                         description="Try a different trade category, location, or remove some filters."
                         actionLabel="Clear all filters"
                         onAction={() => setFilters({ category: null, state: null, badgeLevel: null, search: "" })}
                         className="bg-transparent border-none"
                       />
                     );
                   } else {
                     // Generic empty state (no needs in platform)
                     return (
                       <EmptyState 
                         icon={Search}
                         title="No active needs at the moment"
                         description="Check back soon or create a need for a tradesperson you know."
                         actionLabel="Create a Need"
                         onAction={() => window.location.href = "/onboarding"}
                         className="bg-transparent border-none"
                       />
                     );
                   }
                 })()}
              </div>
            )}
         </div>
         
         {/* End-of-Feed CTA */}
         {!loading && needs.length > 0 && (
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6 }}
             className="mt-8 rounded-[2rem] p-10 md:p-16 text-center relative overflow-hidden"
             style={{ 
               background: 'var(--color-surface-container)',
               boxShadow: '0 8px 30px rgba(0,0,0,0.03)'
             }}
           >
             <div className="relative z-10 flex flex-col items-center gap-6 max-w-lg mx-auto">
               <p className="text-xl md:text-2xl font-black" style={{ color: 'var(--color-on-surface)' }}>
                 You&apos;ve seen all open needs.
               </p>
               <p className="text-base font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>
                 Know a tradesperson who needs backing? Help them get started on BuildBridge.
               </p>
               <div className="flex flex-col sm:flex-row gap-4 items-center">
                 <Link 
                   href="/onboarding"
                   className="inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-3.5 rounded-full text-base font-black tracking-wide shadow-lg hover:shadow-xl transition-all"
                 >
                   Create a Need
                   <ArrowRight className="h-4 w-4" />
                 </Link>
                 <button 
                   onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                   className="px-6 py-3 rounded-full font-bold text-on-surface-variant hover:bg-surface-variant/50 transition-colors"
                 >
                   Back to top
                 </button>
               </div>
             </div>
           </motion.div>
         )}
       </div>
      </section>
    </div>
  )
}
