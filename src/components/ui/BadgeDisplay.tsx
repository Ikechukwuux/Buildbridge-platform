"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  ShieldCheck,
  Hammer,
  TrendingUp,
  Award,
  Info,
  CheckCircle2,
  Circle,
} from "lucide-react"
import { Card } from "./Card"
import {
  type DerivedTrustBadges,
  TRUST_BADGE_META,
  type TrustBadgeKey,
} from "@/lib/trust-badges"

const CARD_META: Record<
  TrustBadgeKey,
  {
    icon: React.ElementType
    howTo: string
    bg: string
    color: string
  }
> = {
  id_verified: {
    icon: ShieldCheck,
    howTo: "Submit your NIN or BVN for instant identity verification.",
    bg: "bg-emerald-500/10",
    color: "text-emerald-600",
  },
  trade_verified: {
    icon: Hammer,
    howTo: "Upload portfolio photos and get reviewed by the BuildBridge team.",
    bg: "bg-primary/10",
    color: "text-primary",
  },
  campaign_active: {
    icon: TrendingUp,
    howTo: "Create your first need and get it approved by admin.",
    bg: "bg-blue-500/10",
    color: "text-blue-600",
  },
  build_bridge_verified: {
    icon: Award,
    howTo: "Complete a funded need and upload approved proof of purchase.",
    bg: "bg-amber-500/10",
    color: "text-amber-600",
  },
}

const ORDER: TrustBadgeKey[] = [
  "id_verified",
  "trade_verified",
  "campaign_active",
  "build_bridge_verified",
]

export interface BadgeDisplayProps {
  /** Pass derived badges so each card can show earned/unearned state. */
  badges?: DerivedTrustBadges
}

export function BadgeDisplay({ badges }: BadgeDisplayProps = {}) {
  return (
    <div className="flex flex-col gap-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center flex flex-col items-center gap-4"
      >
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest"
          style={{ background: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' }}
        >
          <Info className="h-3.5 w-3.5" />
          Trust System
        </div>
        <h2 className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: 'var(--color-on-surface)' }}>
          Trust Badges
        </h2>
        <p className="text-lg font-medium max-w-2xl" style={{ color: 'var(--color-on-surface-variant)' }}>
          Earn each of the four independent badges as you build your reputation on BuildBridge. Each badge appears on your campaign cards and profile.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ORDER.map((key, index) => {
          const meta = TRUST_BADGE_META[key]
          const cfg = CARD_META[key]
          const Icon = cfg.icon
          const earned = badges?.[key] ?? false

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06, duration: 0.4 }}
            >
              <Card className="p-5 flex flex-col gap-4 bg-white border-outline-variant/30 hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 group shadow-sm h-full rounded-[1.5rem]">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center ${earned ? cfg.bg : 'bg-surface-variant/40'} ${earned ? cfg.color : 'text-on-surface-variant/40'}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  {earned ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-on-surface-variant/30" />
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <p className="text-sm font-black text-on-surface">{meta.label}</p>
                  <p className="text-xs font-medium leading-snug text-on-surface-variant">
                    {meta.description}
                  </p>
                </div>

                <div
                  className="mt-auto p-3 rounded-xl"
                  style={{ background: 'var(--color-surface-container)' }}
                >
                  <p
                    className="text-[10px] font-black uppercase tracking-widest mb-1"
                    style={{ color: earned ? 'var(--color-on-surface-variant)' : 'var(--color-primary)' }}
                  >
                    {earned ? "Earned" : "How to earn"}
                  </p>
                  <p className="text-xs font-medium leading-snug text-on-surface-variant">
                    {cfg.howTo}
                  </p>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
