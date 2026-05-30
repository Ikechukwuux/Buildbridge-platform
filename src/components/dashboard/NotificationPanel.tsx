"use client"

import * as React from "react"
import Link from "next/link"
import {
  Bell,
  CheckCheck,
  Heart,
  TrendingUp,
  Camera,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

type NotificationRow = {
  id: string
  type: string
  message: string
  message_data: Record<string, any> | null
  need_id: string | null
  read: boolean
  read_at: string | null
  created_at: string
}

const TYPE_META: Record<string, { icon: LucideIcon; tint: string }> = {
  pledge_received: { icon: Heart, tint: "text-rose-500 bg-rose-500/10" },
  first_pledge_celebration: { icon: Sparkles, tint: "text-amber-500 bg-amber-500/10" },
  milestone_50: { icon: TrendingUp, tint: "text-blue-500 bg-blue-500/10" },
  milestone_80: { icon: TrendingUp, tint: "text-indigo-500 bg-indigo-500/10" },
  milestone_100: { icon: CheckCircle2, tint: "text-emerald-500 bg-emerald-500/10" },
  proof_nudge_day3: { icon: Camera, tint: "text-amber-500 bg-amber-500/10" },
  proof_nudge_day7: { icon: Camera, tint: "text-amber-600 bg-amber-500/10" },
  proof_nudge_day14: { icon: Camera, tint: "text-red-500 bg-red-500/10" },
  proof_submitted: { icon: Camera, tint: "text-emerald-500 bg-emerald-500/10" },
  disbursement_complete: { icon: CheckCircle2, tint: "text-emerald-500 bg-emerald-500/10" },
  vouch_received: { icon: ShieldCheck, tint: "text-primary bg-primary/10" },
  need_approved: { icon: CheckCircle2, tint: "text-emerald-500 bg-emerald-500/10" },
  need_rejected: { icon: Bell, tint: "text-red-500 bg-red-500/10" },
  account_flagged: { icon: Bell, tint: "text-red-500 bg-red-500/10" },
}

const FALLBACK_META = { icon: Bell, tint: "text-on-surface-variant bg-surface-variant/30" }

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime()
  const diffMs = Date.now() - then
  if (Number.isNaN(then)) return ""
  if (diffMs < 0) return "just now"
  const sec = Math.floor(diffMs / 1000)
  if (sec < 60) return "just now"
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const day = Math.floor(hr / 24)
  if (day < 7) return `${day}d ago`
  const wk = Math.floor(day / 7)
  if (wk < 4) return `${wk}w ago`
  const mo = Math.floor(day / 30)
  if (mo < 12) return `${mo}mo ago`
  return `${Math.floor(day / 365)}y ago`
}

export function NotificationPanel({ userId }: { userId: string | null }) {
  const supabase = React.useMemo(() => createClient(), [])
  const [items, setItems] = React.useState<NotificationRow[]>([])
  const [loading, setLoading] = React.useState(true)
  const [marking, setMarking] = React.useState(false)

  const fetchItems = React.useCallback(async () => {
    if (!userId) {
      setItems([])
      setLoading(false)
      return
    }
    setLoading(true)
    const { data, error } = await supabase
      .from("notifications")
      .select("id, type, message, message_data, need_id, read, read_at, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(8)

    if (error) {
      console.error("[NotificationPanel] fetch failed:", error.message)
      setItems([])
    } else {
      setItems(data || [])
    }
    setLoading(false)
  }, [supabase, userId])

  React.useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const unread = items.filter(n => !n.read).length

  const markAllRead = async () => {
    if (!userId || unread === 0) return
    setMarking(true)
    const { error } = await supabase
      .from("notifications")
      .update({ read: true, read_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("read", false)
    if (!error) {
      setItems(prev => prev.map(n => ({ ...n, read: true })))
    }
    setMarking(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between pl-2">
        <h3 className="text-xs font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
          Notifications
          {unread > 0 && (
            <span className="rounded-full bg-primary text-on-primary text-[9px] font-black px-2 py-0.5">
              {unread}
            </span>
          )}
        </h3>
        {unread > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            disabled={marking}
            className="text-[10px] uppercase font-black tracking-widest text-primary hover:underline disabled:opacity-50 flex items-center gap-1"
          >
            <CheckCheck className="h-3 w-3" />
            Mark all read
          </button>
        )}
      </div>

      <div className="rounded-[2.5rem] bg-surface border border-outline-variant/30 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 flex flex-col gap-3">
            {[0, 1, 2].map(i => (
              <div key={i} className="h-12 bg-surface-variant/30 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="p-6 flex flex-col items-center text-center gap-2">
            <div className="h-10 w-10 rounded-full bg-surface-variant/50 flex items-center justify-center text-on-surface-variant/50">
              <Bell className="h-5 w-5" />
            </div>
            <p className="text-sm font-bold text-on-surface">You're all caught up</p>
            <p className="text-xs text-on-surface-variant/70 font-medium">
              Funding alerts, milestone unlocks, and admin messages will appear here.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-outline-variant/20">
            {items.map(n => {
              const meta = TYPE_META[n.type] || FALLBACK_META
              const Icon = meta.icon
              const href = n.need_id ? `/dashboard/needs/${n.need_id}` : "/dashboard"
              return (
                <li key={n.id}>
                  <Link
                    href={href}
                    className={cn(
                      "flex items-start gap-3 px-5 py-4 transition-colors hover:bg-surface-variant/30",
                      !n.read && "bg-primary/5"
                    )}
                  >
                    <div className={cn("h-9 w-9 rounded-2xl flex items-center justify-center shrink-0", meta.tint)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                      <p className={cn("text-sm leading-snug text-on-surface", !n.read ? "font-black" : "font-medium")}>
                        {n.message}
                      </p>
                      <p className="text-[10px] uppercase tracking-widest font-black text-on-surface-variant/50">
                        {relativeTime(n.created_at)}
                      </p>
                    </div>
                    {!n.read && <span className="h-2 w-2 rounded-full bg-primary mt-1 shrink-0" />}
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
