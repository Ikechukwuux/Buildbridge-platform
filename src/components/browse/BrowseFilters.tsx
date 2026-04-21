"use client"

import * as React from "react"
import { Search, X, ChevronDown, Filter } from "lucide-react"
import { Badge } from "@/components/ui/Badge"
import { TRADE_CATEGORIES, NIGERIAN_STATES } from "@/lib/constants"
import { cn } from "@/lib/utils"

interface BrowseFiltersProps {
  onFilterChange: (filters: any) => void;
  activeFilters: {
    category: string | null;
    state: string | null;
    badgeLevel: number | null;
    search: string;
  };
}

const BADGE_LABELS: Record<number, string> = {
  1: "Community",
  2: "Trusted",
  3: "Established",
  4: "Verified",
}

export function BrowseFilters({ onFilterChange, activeFilters }: BrowseFiltersProps) {
  const [isStatesOpen, setIsStatesOpen] = React.useState(false)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [showLeftFade, setShowLeftFade] = React.useState(false)
  const [showRightFade, setShowRightFade] = React.useState(true)

  const handleCategoryToggle = (id: string) => {
    onFilterChange({ 
      ...activeFilters, 
      category: activeFilters.category === id ? null : id 
    })
  }

  const handleStateSelect = (state: string) => {
    onFilterChange({ 
      ...activeFilters, 
      state: activeFilters.state === state ? null : state 
    })
    setIsStatesOpen(false)
  }

  const handleBadgeToggle = (level: number) => {
    onFilterChange({ 
      ...activeFilters, 
      badgeLevel: activeFilters.badgeLevel === level ? null : level 
    })
  }

  // Handle scroll fade indicators
  const updateScrollFade = React.useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setShowLeftFade(el.scrollLeft > 10)
    setShowRightFade(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }, [])

  React.useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener("scroll", updateScrollFade, { passive: true })
    updateScrollFade()
    return () => el.removeEventListener("scroll", updateScrollFade)
  }, [updateScrollFade])

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Search & State Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary opacity-60" />
          <input 
            type="text"
            placeholder="Search tradespeople, items, or locations..."
            value={activeFilters.search}
            onChange={(e) => onFilterChange({ ...activeFilters, search: e.target.value })}
            className="w-full h-14 pl-12 pr-4 rounded-full bg-surface border-2 border-outline-variant/50 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 text-base font-medium transition-all"
            style={{ color: 'var(--color-on-surface)' }}
          />
          {activeFilters.search && (
            <button 
              onClick={() => onFilterChange({ ...activeFilters, search: "" })}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-on-surface/10 rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-on-surface-variant" />
            </button>
          )}
        </div>

        <div className="relative min-w-[200px]">
          <button 
            onClick={() => setIsStatesOpen(!isStatesOpen)}
            className="w-full h-14 flex items-center justify-between px-5 rounded-full bg-surface border-2 border-outline-variant/50 text-base font-medium text-on-surface hover:border-primary transition-all"
          >
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary" />
              <span>{activeFilters.state || "Everywhere"}</span>
            </div>
            <div className="flex items-center gap-2">
               {activeFilters.state && (
                  <button 
                     onClick={(e) => {
                        e.stopPropagation();
                        handleStateSelect("");
                     }}
                     className="p-1 hover:bg-on-surface/10 rounded-full transition-colors"
                  >
                     <X className="h-4 w-4 text-error" />
                  </button>
               )}
               <ChevronDown className={cn("h-4 w-4 transition-transform", isStatesOpen && "rotate-180")} />
            </div>
          </button>
          
          {isStatesOpen && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setIsStatesOpen(false)} />
              <div className="absolute top-[calc(100%+8px)] left-0 w-full max-h-64 overflow-y-auto z-30 bg-white border border-outline-variant/30 shadow-xl rounded-2xl p-2 animate-in fade-in zoom-in-95">
                <button 
                  onClick={() => handleStateSelect("")}
                  className="w-full text-left p-3 rounded-xl hover:bg-primary/5 text-sm font-medium"
                >
                  All Nigeria
                </button>
                {NIGERIAN_STATES.map((state) => (
                  <button 
                    key={state}
                    onClick={() => handleStateSelect(state)}
                    className={cn(
                        "w-full text-left p-3 rounded-xl hover:bg-primary/5 text-sm font-medium transition-colors",
                        activeFilters.state === state && "bg-primary/10 text-primary font-bold"
                    )}
                  >
                    {state}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Trade Categories Scroll with Fade */}
      <div className="flex flex-col gap-3">
        <p className="text-[10px] uppercase font-black tracking-widest pl-1" style={{ color: 'var(--color-on-surface-variant)' }}>
          Specialization
        </p>
        <div className="relative">
          {/* Left fade */}
          {showLeftFade && (
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none rounded-l-full" />
          )}
          {/* Right fade */}
          {showRightFade && (
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none rounded-r-full" />
          )}

          <div 
            ref={scrollRef}
            className="flex overflow-x-auto pb-2 gap-3 no-scrollbar scroll-smooth"
          >
            {TRADE_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeFilters.category === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryToggle(cat.id)}
                  className={cn(
                    "flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-full border-2 transition-all whitespace-nowrap",
                    isActive
                      ? "bg-primary border-primary text-on-primary shadow-md shadow-primary/20"
                      : "bg-white border-outline-variant/50 text-on-surface hover:border-primary/50 hover:shadow-sm"
                  )}
                >
                  <Icon className={cn("h-4 w-4", !isActive && "text-primary")} />
                  <span className="text-sm font-bold">{cat.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Trust Levels with Labels */}
      <div className="flex flex-col gap-3">
        <p className="text-[10px] uppercase font-black tracking-widest pl-1" style={{ color: 'var(--color-on-surface-variant)' }}>
          Verification Level
        </p>
        <div className="flex flex-wrap gap-3">
          {[1, 2, 3, 4].map((level) => (
            <button 
              key={level} 
              onClick={() => handleBadgeToggle(level)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-full border-2 transition-all",
                activeFilters.badgeLevel === level 
                  ? "border-primary bg-primary/5 shadow-sm" 
                  : "border-outline-variant/50 bg-white opacity-70 hover:opacity-100 hover:border-primary/30"
              )}
            >
               <Badge 
                  level={level as any} 
                  className={cn(
                      "cursor-pointer transition-all",
                      activeFilters.badgeLevel === level ? "scale-105" : "grayscale-[0.3]"
                  )} 
               />
               <span className={cn(
                 "text-xs font-bold uppercase tracking-wider",
                 activeFilters.badgeLevel === level ? "text-primary" : "text-on-surface-variant"
               )}>
                 {BADGE_LABELS[level]}
               </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
