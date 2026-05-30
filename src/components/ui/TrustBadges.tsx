import * as React from "react"
import { ShieldCheck, Hammer, TrendingUp, Award, Circle } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  type DerivedTrustBadges,
  TRUST_BADGE_META,
  type TrustBadgeKey,
} from "@/lib/trust-badges"

const BADGE_CONFIG: Record<
  TrustBadgeKey,
  { icon: React.ElementType; earnedClass: string }
> = {
  id_verified: {
    icon: ShieldCheck,
    earnedClass: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  },
  trade_verified: {
    icon: Hammer,
    earnedClass: "bg-primary/10 text-primary border-primary/20",
  },
  campaign_active: {
    icon: TrendingUp,
    earnedClass: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  },
  build_bridge_verified: {
    icon: Award,
    earnedClass: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  },
}

interface TrustBadgesProps {
  badges: DerivedTrustBadges
  size?: "sm" | "md"
  /** Show locked badges in muted state. Default true. */
  showLocked?: boolean
  /** Show labels next to icons. Default true. */
  showLabels?: boolean
  className?: string
}

const ORDER: TrustBadgeKey[] = [
  "id_verified",
  "trade_verified",
  "campaign_active",
  "build_bridge_verified",
]

export function TrustBadges({
  badges,
  size = "md",
  showLocked = true,
  showLabels = true,
  className,
}: TrustBadgesProps) {
  const pillClass =
    size === "sm"
      ? "h-7 px-2.5 text-[10px] gap-1.5"
      : "h-9 px-3 text-xs gap-2"
  const iconSize = size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"

  const items = ORDER.filter(key => showLocked || badges[key])

  if (items.length === 0) return null

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {items.map(key => {
        const earned = badges[key]
        const meta = TRUST_BADGE_META[key]
        const cfg = BADGE_CONFIG[key]
        const Icon = earned ? cfg.icon : Circle
        return (
          <div
            key={key}
            className={cn(
              "inline-flex items-center rounded-full border font-black uppercase tracking-widest transition-colors",
              pillClass,
              earned
                ? cfg.earnedClass
                : "bg-surface-variant/30 text-on-surface-variant/40 border-outline-variant/30"
            )}
            title={
              earned
                ? `${meta.label} — ${meta.description}`
                : `${meta.label} — Not yet earned`
            }
          >
            <Icon className={iconSize} strokeWidth={earned ? 2.5 : 1.5} />
            {showLabels && <span>{meta.label}</span>}
          </div>
        )
      })}
    </div>
  )
}
