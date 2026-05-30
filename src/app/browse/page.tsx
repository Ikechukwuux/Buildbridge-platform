"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { NeedCard, NeedCardSkeleton } from "@/components/ui/NeedCard"
import { EmptyState } from "@/components/ui/EmptyState"
import { BrowseFilters } from "@/components/browse/BrowseFilters"
import { BrowseSort, type SortOption } from "@/components/browse/BrowseSort"
import { getNeeds } from "./actions"
import { Search, MapPin, Sparkles, ArrowRight, X, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

// Rich mock needs for the browse page (always shown as padding)
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
      full_name: "Amina S.",
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
      full_name: "Chidi O.",
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
      full_name: "Fatima B.",
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
      full_name: "Ibrahim K.",
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
      full_name: "Grace N.",
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
      full_name: "Emeka A.",
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
  
  const PAGE_SIZE = 9

  // State for filters
  const [filters, setFilters] = React.useState({
    category: null as string | null,
    state: null as string | null,
    badgeLevel: null as number | null,
    search: "",
    fundedMin: null as number | null,
    daysMax: null as number | null,
  })

  const [page, setPage] = React.useState(1)
  
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

  // Reset to page 1 when filters change
  React.useEffect(() => { setPage(1) }, [filters.category, filters.state, filters.badgeLevel, debouncedSearch, filters.fundedMin, filters.daysMax])

  // Check if any filter is active
  const hasActiveFilters = filters.category !== null || filters.state !== null || filters.badgeLevel !== null || debouncedSearch !== "" || filters.fundedMin !== null || filters.daysMax !== null

  const clearAllFilters = () => {
    setFilters({ category: null, state: null, badgeLevel: null, search: "", fundedMin: null, daysMax: null })
  }

  // Fetch real needs from DB and merge with mock data
  const fetchNeeds = React.useCallback(async () => {
    setLoading(true)

    // 1. Fetch real active needs via Server Action (which uses Redis caching)
    let realNeeds: any[] = []
    try {
      realNeeds = await getNeeds()
    } catch (err) {
      console.error("Failed to fetch real needs:", err)
    }

    // 2. Tag mock needs
    const mockNeeds = MOCK_BROWSE_NEEDS.map(n => ({ ...n, _isReal: false }))

    // 3. Merge: real needs first, then mock padding
    let merged = [...realNeeds, ...mockNeeds]

    // 4. Apply filters
    if (filters.category) {
      merged = merged.filter(n => n.profile?.trade_category === filters.category)
    }
    if (filters.state) {
      merged = merged.filter(n => (n.profile?.location_state || "").toLowerCase() === filters.state!.toLowerCase())
    }
    if (filters.badgeLevel !== null) {
      const levels = ['level_1_community_member', 'level_2_trusted_tradesperson', 'level_3_established', 'level_4_platform_verified']
      merged = merged.filter(n => n.profile?.badge_level === levels[filters.badgeLevel! - 1])
    }
    if (debouncedSearch) {
      const search = debouncedSearch.toLowerCase()
      merged = merged.filter(n =>
        n.item_name.toLowerCase().includes(search) ||
        n.story.toLowerCase().includes(search) ||
        (n.profile?.name || n.profile?.full_name || "").toLowerCase().includes(search)
      )
    }
    if (filters.fundedMin !== null) {
      merged = merged.filter(n => {
        const pct = n.item_cost > 0 ? (n.funded_amount / n.item_cost) * 100 : 0
        return pct >= filters.fundedMin!
      })
    }
    if (filters.daysMax !== null) {
      const now = Date.now()
      merged = merged.filter(n => {
        const diffDays = Math.ceil((new Date(n.deadline).getTime() - now) / (1000 * 60 * 60 * 24))
        return diffDays >= 0 && diffDays <= filters.daysMax!
      })
    }

    // 5. Sort — real needs always rank above mock needs within the same sort order
    merged.sort((a, b) => {
      // Real needs always come first
      if (a._isReal && !b._isReal) return -1
      if (!a._isReal && b._isReal) return 1

      // Within the same tier, apply the selected sort
      switch (sort) {
        case 'urgent':
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'nearly_funded':
          return (b.funded_amount / b.item_cost) - (a.funded_amount / a.item_cost)
        case 'most_pledged':
          return b.funded_amount - a.funded_amount
        default:
          return 0
      }
    })

    setNeeds(merged)
    setLoading(false)
  }, [filters.category, filters.state, filters.badgeLevel, debouncedSearch, filters.fundedMin, filters.daysMax, sort])

  React.useEffect(() => {
    fetchNeeds()
  }, [fetchNeeds])

  const totalCount = needs.length
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const pagedNeeds = needs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

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
              {loading ? "Loading..." : `${totalCount} Active Needs Across Nigeria`}
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
              Donate to verified tradespeople building their futures. Your pledge is held securely and released in stages as artisans hit milestones and upload proof.
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
                  <span className="text-on-surface font-black">{loading ? "..." : totalCount}</span>{" "}
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
            ) : pagedNeeds.length > 0 ? (
              pagedNeeds.map((need, index) => (
                <motion.div
                  key={need.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
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
                         description="Know a tradesperson here who needs support? Help them get started."
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
                         onAction={() => setFilters({ category: null, state: null, badgeLevel: null, search: "", fundedMin: null, daysMax: null })}
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
         
         {/* Pagination */}
         {!loading && totalPages > 1 && (
           <div className="flex items-center justify-center gap-3 mt-4">
             <button
               onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
               disabled={page === 1}
               className="h-11 w-11 rounded-full border-2 border-outline-variant/50 flex items-center justify-center text-on-surface hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
               aria-label="Previous page"
             >
               <ChevronLeft className="h-5 w-5" />
             </button>

             <div className="flex items-center gap-2">
               {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                 <button
                   key={p}
                   onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                   className={`h-11 min-w-[44px] px-3 rounded-full text-sm font-black transition-all ${
                     p === page
                       ? 'bg-primary text-on-primary shadow-md shadow-primary/20'
                       : 'border-2 border-outline-variant/50 text-on-surface hover:border-primary hover:text-primary'
                   }`}
                 >
                   {p}
                 </button>
               ))}
             </div>

             <button
               onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
               disabled={page === totalPages}
               className="h-11 w-11 rounded-full border-2 border-outline-variant/50 flex items-center justify-center text-on-surface hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
               aria-label="Next page"
             >
               <ChevronRight className="h-5 w-5" />
             </button>
           </div>
         )}

         {/* End-of-Feed CTA — only on last page */}
         {!loading && needs.length > 0 && page === totalPages && (
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6 }}
             className="mt-4 rounded-[2rem] p-10 md:p-16 text-center relative overflow-hidden"
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
                 Know a tradesperson who needs support? Help them get started on BuildBridge.
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
