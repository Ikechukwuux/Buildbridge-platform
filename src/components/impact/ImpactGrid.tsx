"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ImpactCard } from "./ImpactCard"
import { type ImpactWallSubmission, type Profile } from "@/types"
import { Camera, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImpactGridProps {
  submissions: (ImpactWallSubmission & { profile: Profile })[]
}

function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr))
}

export function ImpactGrid({ submissions }: ImpactGridProps) {
  const [tradeFilter, setTradeFilter] = React.useState<string | null>(null)
  const [stateFilter, setStateFilter] = React.useState<string | null>(null)

  const trades = unique(
    submissions
      .map(s => s.profile.trade_category as string | null | undefined)
      .filter((t): t is string => !!t)
  )

  const states = unique(
    submissions
      .map(s => (s.profile as any).location_state)
      .filter((s): s is string => !!s)
  ).map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())

  const filtered = submissions.filter(s => {
    if (tradeFilter && s.profile.trade_category !== tradeFilter) return false
    if (stateFilter && (s.profile as any).location_state?.toLowerCase() !== stateFilter.toLowerCase()) return false
    return true
  })

  const hasFilters = tradeFilter !== null || stateFilter !== null

  if (submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-6">
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center"
          style={{ background: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' }}
        >
          <Camera className="h-10 w-10" />
        </div>
        <h3 className="text-2xl font-black" style={{ color: 'var(--color-on-surface)' }}>
          The wall of success is being built...
        </h3>
        <p className="text-base font-medium max-w-md" style={{ color: 'var(--color-on-surface-variant)' }}>
          As tradespeople complete their funded projects, their stories will appear here. Be the first to donate to a tradesperson and help fill this wall.
        </p>
        <a
          href="/browse"
          className="inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-3.5 rounded-full text-base font-black tracking-wide shadow-lg hover:shadow-xl transition-all"
        >
          Browse Active Needs
        </a>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Filters */}
      <div className="flex flex-col gap-4">
        {trades.length > 1 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant/60 mr-1">Trade:</span>
            {trades.map(trade => (
              <button
                key={trade}
                onClick={() => setTradeFilter(tradeFilter === trade ? null : trade)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border-2 transition-all",
                  tradeFilter === trade
                    ? "bg-primary border-primary text-on-primary"
                    : "border-outline-variant/50 text-on-surface-variant hover:border-primary/50"
                )}
              >
                {trade.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        )}

        {states.length > 1 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant/60 mr-1">State:</span>
            {states.map(state => (
              <button
                key={state}
                onClick={() => setStateFilter(stateFilter?.toLowerCase() === state.toLowerCase() ? null : state)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border-2 transition-all",
                  stateFilter?.toLowerCase() === state.toLowerCase()
                    ? "bg-primary border-primary text-on-primary"
                    : "border-outline-variant/50 text-on-surface-variant hover:border-primary/50"
                )}
              >
                {state}
              </button>
            ))}
          </div>
        )}

        {hasFilters && (
          <button
            onClick={() => { setTradeFilter(null); setStateFilter(null) }}
            className="self-start flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-error hover:underline"
          >
            <X className="h-3.5 w-3.5" />
            Clear filters
          </button>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-on-surface-variant font-medium">
          No stories match this filter. <button className="font-black text-primary hover:underline ml-1" onClick={() => { setTradeFilter(null); setStateFilter(null) }}>Clear filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filtered.map((submission, index) => (
            <motion.div
              key={submission.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(index, 5) * 0.08, duration: 0.5 }}
            >
              <ImpactCard submission={submission} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
