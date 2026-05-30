"use client"

import * as React from "react"
import { Receipt, Heart, ChevronRight } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

type PledgeRow = {
  id: string
  amount: number
  message: string | null
  payment_status: string | null
  created_at: string
  need_id: string
  fee_breakdown_json: any
  needs?: {
    id: string
    item_name: string
  } | null
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

function formatNGN(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount)
}

interface TransactionHistoryProps {
  needIds: string[]
}

export function TransactionHistory({ needIds }: TransactionHistoryProps) {
  const supabase = React.useMemo(() => createClient(), [])
  const [items, setItems] = React.useState<PledgeRow[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let cancelled = false
    const run = async () => {
      if (needIds.length === 0) {
        setItems([])
        setLoading(false)
        return
      }
      setLoading(true)
      const { data, error } = await supabase
        .from("pledges")
        .select("id, amount, message, payment_status, created_at, need_id, fee_breakdown_json, needs:need_id(id, item_name)")
        .in("need_id", needIds)
        .eq("payment_status", "completed")
        .order("created_at", { ascending: false })
        .limit(10)

      if (cancelled) return
      if (error) {
        console.error("[TransactionHistory] fetch failed:", error.message)
        setItems([])
      } else {
        setItems((data as any) || [])
      }
      setLoading(false)
    }
    run()
    return () => {
      cancelled = true
    }
  }, [supabase, needIds.join(",")])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-display-small font-black text-on-surface tracking-tight">
          Recent Pledges
        </h2>
      </div>

      <div className="rounded-[2.5rem] bg-surface border border-outline-variant/30 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 flex flex-col gap-3">
            {[0, 1, 2].map(i => (
              <div key={i} className="h-14 bg-surface-variant/30 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="p-10 flex flex-col items-center text-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-surface-variant/40 flex items-center justify-center text-on-surface-variant/60">
              <Receipt className="h-6 w-6" />
            </div>
            <p className="text-sm font-black text-on-surface">No pledges yet</p>
            <p className="text-xs font-medium text-on-surface-variant/70 max-w-xs">
              When backers donate to your needs, the pledges will appear here with the amount and date.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-outline-variant/20">
            {items.map(p => {
              const tradespersonReceives =
                Number(p.fee_breakdown_json?.tradesperson_receives) || Number(p.amount) || 0
              return (
                <li key={p.id}>
                  <Link
                    href={`/dashboard/needs/${p.need_id}`}
                    className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-surface-variant/30"
                  >
                    <div className="h-10 w-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                      <Heart className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <p className="text-sm font-black text-on-surface truncate">
                        {p.needs?.item_name || "Pledge received"}
                      </p>
                      <p className="text-xs font-medium text-on-surface-variant/70">
                        {relativeDate(p.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-on-surface">
                        +{formatNGN(tradespersonReceives / 100)}
                      </p>
                      <p className="text-[10px] uppercase tracking-widest font-black text-on-surface-variant/50">
                        net to you
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-on-surface-variant/30 shrink-0" />
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
