"use client"

import { useState } from "react"
import { markDeletionRequestProcessed } from "@/app/actions/account-deletion"
import { Button } from "@/components/ui/Button"
import { CheckCircle2, Loader2, Clock, Mail } from "lucide-react"

export function AdminDeletionList({ requests }: { requests: any[] }) {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleMarkProcessed = async (id: string) => {
    setLoading(id)
    setError(null)
    try {
      await markDeletionRequestProcessed(id)
      window.location.reload()
    } catch (err: any) {
      setError(err.message)
      setLoading(null)
    }
  }

  if (requests.length === 0) {
    return (
      <div className="p-16 rounded-[2rem] bg-surface border border-outline-variant/30 flex flex-col items-center gap-4 text-center">
        <div className="h-16 w-16 rounded-2xl bg-green-500/10 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-xl font-black text-on-surface">No pending deletion requests</h2>
        <p className="text-on-surface-variant">When users request data deletion, requests show up here.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-sm font-bold text-red-600">
          {error}
        </div>
      )}

      <div className="rounded-[2rem] border border-outline-variant/30 bg-white overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-surface-variant/30 border-b border-outline-variant/20 text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">
          <div className="col-span-3">User</div>
          <div className="col-span-4">Reason</div>
          <div className="col-span-2">Requested</div>
          <div className="col-span-3">Action</div>
        </div>

        {requests.map(req => {
          const requestedDate = new Date(req.requested_at)
          const daysOpen = Math.floor((Date.now() - requestedDate.getTime()) / (1000 * 60 * 60 * 24))
          const sla = 30 - daysOpen
          return (
            <div
              key={req.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-6 py-5 border-b border-outline-variant/10 last:border-b-0 items-start hover:bg-surface-variant/10 transition-colors"
            >
              <div className="md:col-span-3 flex flex-col gap-0.5">
                <p className="text-sm font-black text-on-surface flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-on-surface-variant" />
                  {req.email || "—"}
                </p>
                <p className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest">
                  user: {req.user_id.slice(0, 8)}…
                </p>
              </div>

              <div className="md:col-span-4">
                <p className="text-sm text-on-surface-variant line-clamp-3">
                  {req.reason || <span className="text-on-surface-variant/40 italic">No reason given</span>}
                </p>
              </div>

              <div className="md:col-span-2 flex flex-col gap-1">
                <p className="text-xs font-bold text-on-surface flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {requestedDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </p>
                <p className={`text-[10px] uppercase font-black tracking-widest ${sla <= 5 ? "text-red-600" : sla <= 14 ? "text-amber-600" : "text-on-surface-variant/50"}`}>
                  {sla > 0 ? `${sla}d left` : "Overdue"}
                </p>
              </div>

              <div className="md:col-span-3 flex items-center gap-2">
                <Button
                  onClick={() => handleMarkProcessed(req.id)}
                  disabled={loading === req.id}
                  className="h-10 rounded-full text-xs font-black bg-success text-on-success hover:bg-success/90 shadow flex-1"
                >
                  {loading === req.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                      Mark processed
                    </>
                  )}
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
