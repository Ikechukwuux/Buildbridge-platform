"use client"

import * as React from "react"
import { NeedCard, NeedCardSkeleton } from "@/components/ui/NeedCard"
import { EmptyState } from "@/components/ui/EmptyState"
import { BrowseFilters } from "@/components/browse/BrowseFilters"
import { BrowseSort, type SortOption } from "@/components/browse/BrowseSort"
import { Search } from "lucide-react"

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
    photo_url: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&q=80&w=800",
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
      photo_url: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=200",
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
    photo_url: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800",
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
      photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
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
    photo_url: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&q=80&w=800",
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
      photo_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
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
    photo_url: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800",
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
      photo_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200",
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
    photo_url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800",
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
      photo_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
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
    photo_url: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=800",
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
      photo_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
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
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl flex flex-col gap-10">
        
        {/* Header Section */}
        <div className="flex flex-col gap-4">
           <h1 className="text-display-small sm:text-display-medium font-black text-on-surface">
              Discover <span className="text-primary italic">Needs.</span>
           </h1>
           <p className="text-body-large text-on-surface-variant max-w-2xl">
              Back verified tradespeople building their futures. Every pledge is held in escrow and only deployed once goals are reached.
           </p>
        </div>

        {/* Filters & Sort Interface */}
        <div className="flex flex-col gap-6 p-6 rounded-3xl bg-surface-variant/30 border border-outline-variant shadow-none">
           <BrowseFilters onFilterChange={setFilters} activeFilters={filters} />
           
           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-outline-variant/30">
              <div className="text-body-medium font-bold text-on-surface-variant">
                 Showing <span className="text-on-surface">{needs.length}</span> active needs
              </div>
              <BrowseSort onSortChange={setSort} activeSort={sort} />
           </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
           {loading ? (
             Array.from({ length: 6 }).map((_, i) => (
                <NeedCardSkeleton key={i} />
             ))
           ) : needs.length > 0 ? (
             needs.map((need) => (
                <NeedCard key={need.id} need={need} onBack={() => {}} />
             ))
           ) : (
             <div className="col-span-full py-20 px-4">
                <EmptyState 
                   icon={Search}
                   title="No matches found"
                   description="We couldn't find any needs matching these filters. Try expanding your search or clearing the selection."
                   actionLabel="Clear All Filters"
                   onAction={() => setFilters({ category: null, state: null, badgeLevel: null, search: "" })}
                   className="bg-transparent border-none"
                />
             </div>
           )}
        </div>
      </div>
    </div>
  )
}
