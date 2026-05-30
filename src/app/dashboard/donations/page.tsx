"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Heart,
  TrendingUp,
  Sparkles,
  Search,
  ArrowRight,
  CheckCircle2,
  Clock,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/Button"
import { EmptyState } from "@/components/ui/EmptyState"
import { cn } from "@/lib/utils"

type DonationRow = {
  id: string
  amount: number
  payment_status: string | null
  created_at: string
  message: string | null
  fee_breakdown_json: any
  need_id: string
  needs?: {
    id: string
    item_name: string
    item_cost: number
    funded_amount: number
    status: string
    photo_url: string | null
    profiles?: {
      full_name: string | null
      trade_category: string | null
      location_state: string | null
      location_lga: string | null
    } | null
  } | null
}

function formatNGN(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount)
}

function relativeDate(iso: string): string {
  const then = new Date(iso).getTime()
  const diffMs = Date.now() - then
  if (Number.isNaN(then)) return ""
  const day = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (day < 1) return "Today"
  if (day < 2) return "Yesterday"
  if (day < 7) return `${day}d ago`
  if (day < 30) return `${Math.floor(day / 7)}w ago`
  if (day < 365) return `${Math.floor(day / 30)}mo ago`
  return `${Math.floor(day / 365)}y ago`
}

const STATUS_META: Record<string, { label: string; tint: string; icon: typeof Heart }> = {
  active: { label: "In progress", tint: "text-blue-600 bg-blue-500/10", icon: TrendingUp },
  funded: { label: "Fully funded", tint: "text-emerald-600 bg-emerald-500/10", icon: CheckCircle2 },
  completed: { label: "Completed", tint: "text-primary bg-primary/10", icon: Sparkles },
  pending_review: { label: "Pending review", tint: "text-amber-600 bg-amber-500/10", icon: Clock },
  expired: { label: "Expired", tint: "text-on-surface-variant bg-surface-variant/40", icon: Clock },
  rejected: { label: "Closed", tint: "text-on-surface-variant bg-surface-variant/40", icon: Clock },
}

export default function DonationsPage() {
  const router = useRouter()
  const supabase = React.useMemo(() => createClient(), [])

  const [loading, setLoading] = React.useState(true)
  const [firstName, setFirstName] = React.useState("Friend")
  const [donations, setDonations] = React.useState<DonationRow[]>([])

  React.useEffect(() => {
    let cancelled = false
    const run = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        router.push("/login?redirectTo=/dashboard/donations")
        return
      }

      if (cancelled) return
      const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "Friend"
      setFirstName(name.split(" ")[0])

      const { data, error } = await supabase
        .from("pledges")
        .select(`
          id, amount, payment_status, created_at, message, fee_breakdown_json, need_id,
          needs:need_id (
            id, item_name, item_cost, funded_amount, status, photo_url,
            profiles:profile_id (full_name, trade_category, location_state, location_lga)
          )
        `)
        .eq("backer_user_id", user.id)
        .eq("payment_status", "completed")
        .order("created_at", { ascending: false })
        .limit(50)

      if (cancelled) return
      if (error) {
        console.error("[Donations] fetch failed:", error.message)
        setDonations([])
      } else {
        setDonations((data as any) || [])
      }
      setLoading(false)
    }
    run()
    return () => {
      cancelled = true
    }
  }, [router, supabase])

  const totals = React.useMemo(() => {
    const totalGiven = donations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0)
    const artisansSupported = new Set(
      donations
        .map(d => d.needs?.profiles?.full_name || d.needs?.id)
        .filter(Boolean)
    ).size
    return { totalGiven, artisansSupported }
  }, [donations])

  if (loading) {
    return (
      <div className="w-full flex flex-col gap-12 animate-pulse">
        <div className="h-32 bg-surface-variant/30 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-28 bg-surface-variant/30 rounded-3xl" />
          <div className="h-28 bg-surface-variant/30 rounded-3xl" />
          <div className="h-28 bg-surface-variant/30 rounded-3xl" />
        </div>
        <div className="h-96 bg-surface-variant/30 rounded-3xl" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-10 pb-10">
      {/* Welcome */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl md:text-5xl font-black text-on-surface tracking-tight">
            Welcome, <span className="text-primary italic">{firstName}!</span>
          </h1>
          <p className="text-body-large text-on-surface-variant max-w-xl">
            Track the artisans you've donated to and the impact of your support.
          </p>
        </div>
        <Button
          onClick={() => router.push("/browse")}
          className="h-14 px-8 rounded-[1.5rem] gap-2 text-title-medium shadow-xl shadow-primary/20 font-black flex items-center"
        >
          <Search className="h-5 w-5" />
          Browse Needs
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-[2rem] bg-surface border border-outline-variant/30 flex flex-col gap-2 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
            <Heart className="h-5 w-5" />
          </div>
          <span className="text-3xl font-black text-on-surface tracking-tight">
            {donations.length}
          </span>
          <span className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant/60">
            Donations made
          </span>
        </div>
        <div className="p-6 rounded-[2rem] bg-surface border border-outline-variant/30 flex flex-col gap-2 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <TrendingUp className="h-5 w-5" />
          </div>
          <span className="text-3xl font-black text-on-surface tracking-tight">
            {formatNGN(totals.totalGiven / 100)}
          </span>
          <span className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant/60">
            Total given
          </span>
        </div>
        <div className="p-6 rounded-[2rem] bg-surface border border-outline-variant/30 flex flex-col gap-2 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-3xl font-black text-on-surface tracking-tight">
            {totals.artisansSupported}
          </span>
          <span className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant/60">
            Artisans supported
          </span>
        </div>
      </div>

      {/* Donations list */}
      <div className="flex flex-col gap-6">
        <h2 className="text-display-small font-black text-on-surface tracking-tight">
          Your Donations
        </h2>

        {donations.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="No donations yet"
            description="When you donate to an artisan on BuildBridge, your support history will appear here."
            actionLabel="Browse Active Needs"
            onAction={() => router.push("/browse")}
          />
        ) : (
          <div className="rounded-[2.5rem] bg-surface border border-outline-variant/30 shadow-sm overflow-hidden">
            <ul className="divide-y divide-outline-variant/20">
              {donations.map((d, idx) => {
                const need = d.needs
                const statusMeta = STATUS_META[need?.status || ""] || STATUS_META.active
                const artisanName = need?.profiles?.full_name || "Artisan"
                const tradespersonReceives =
                  Number(d.fee_breakdown_json?.tradesperson_receives) || Number(d.amount) || 0
                const pct = need
                  ? Math.min(100, Math.floor(((need.funded_amount || 0) / Math.max(1, need.item_cost)) * 100))
                  : 0
                const StatusIcon = statusMeta.icon
                return (
                  <motion.li
                    key={d.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                  >
                    <Link
                      href={need ? `/needs/${need.id}` : "/browse"}
                      className="flex items-center gap-5 px-6 py-5 transition-colors hover:bg-surface-variant/30 group"
                    >
                      <div className="h-14 w-14 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                        <Heart className="h-6 w-6" />
                      </div>
                      <div className="flex flex-col min-w-0 flex-1 gap-1.5">
                        <div className="flex items-center gap-3 flex-wrap">
                          <p className="text-base font-black text-on-surface group-hover:text-primary transition-colors truncate">
                            {need?.item_name || "Donation"}
                          </p>
                          <span
                            className={cn(
                              "rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest flex items-center gap-1",
                              statusMeta.tint
                            )}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {statusMeta.label}
                          </span>
                        </div>
                        <p className="text-xs text-on-surface-variant/70 font-medium">
                          To <span className="font-black text-on-surface">{artisanName}</span> · {relativeDate(d.created_at)}
                        </p>
                        {need && (
                          <div className="flex items-center gap-3 mt-1.5 max-w-md">
                            <div className="relative h-1.5 flex-1 bg-surface-variant/40 rounded-full overflow-hidden">
                              <div
                                className="absolute top-0 left-0 h-full bg-primary rounded-full"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-[10px] uppercase tracking-widest font-black text-on-surface-variant/60">
                              {pct}% funded
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-base font-black text-on-surface">
                          {formatNGN(Number(d.amount) / 100)}
                        </p>
                        <p className="text-[10px] uppercase tracking-widest font-black text-on-surface-variant/50">
                          {formatNGN(tradespersonReceives / 100)} to artisan
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-on-surface-variant/30 group-hover:text-primary transition-colors shrink-0" />
                    </Link>
                  </motion.li>
                )
              })}
            </ul>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      {donations.length > 0 && (
        <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-lg">
            <h3 className="text-2xl font-black text-on-surface tracking-tight">
              Want to support more artisans?
            </h3>
            <p className="text-on-surface-variant font-medium">
              Discover other tradespeople raising funds for tools and equipment that grow their businesses.
            </p>
          </div>
          <Button
            onClick={() => router.push("/browse")}
            className="h-14 px-8 rounded-[1.5rem] gap-2 text-title-medium shadow-lg font-black flex items-center"
          >
            Browse Needs
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  )
}
