"use client"

import { useState } from "react"
import { approveProof, rejectProof } from "./actions"
import { Button } from "@/components/ui/Button"
import { CheckCircle2, XCircle, Loader2, Clock, MapPin, Camera } from "lucide-react"

function formatCost(kobo: number) {
  return `₦${new Intl.NumberFormat("en-NG").format((kobo || 0) / 100)}`
}

function formatState(state: string | null) {
  if (!state) return ""
  return state.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ")
}

export function AdminProofList({ proofs }: { proofs: any[] }) {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState("")

  const handleApprove = async (id: string) => {
    setLoading(id)
    setError(null)
    try {
      await approveProof(id)
      window.location.reload()
    } catch (err: any) {
      setError(err.message)
      setLoading(null)
    }
  }

  const handleRejectConfirm = async () => {
    if (!rejectingId) return
    setLoading(rejectingId)
    setError(null)
    try {
      await rejectProof(rejectingId, rejectReason || undefined)
      window.location.reload()
    } catch (err: any) {
      setError(err.message)
      setLoading(null)
      setRejectingId(null)
    }
  }

  if (proofs.length === 0) {
    return (
      <div className="p-16 rounded-[2rem] bg-surface border border-outline-variant/30 flex flex-col items-center gap-4 text-center">
        <div className="h-16 w-16 rounded-2xl bg-green-500/10 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-xl font-black text-on-surface">All caught up</h2>
        <p className="text-on-surface-variant">No proof submissions awaiting review.</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {proofs.map(need => (
          <div
            key={need.id}
            className="rounded-[1.5rem] bg-white border border-outline-variant/30 overflow-hidden flex flex-col"
          >
            {/* Proof media */}
            <div className="relative aspect-video bg-surface-variant/30">
              {need.proof_photo_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={need.proof_photo_url}
                  alt="Proof of purchase"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : need.proof_video_url ? (
                <video
                  src={need.proof_video_url}
                  controls
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-on-surface-variant/40">
                  <Camera className="h-10 w-10" />
                </div>
              )}
            </div>

            <div className="p-5 flex flex-col gap-3 flex-1">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-black text-on-surface line-clamp-1">
                  {need.item_name}
                </p>
                <p className="text-xs text-on-surface-variant font-medium">
                  by <span className="text-on-surface font-black">{need.profiles?.full_name || "Unknown"}</span>
                </p>
                <div className="flex items-center gap-2 mt-1 text-xs text-on-surface-variant">
                  <span className="font-bold text-primary uppercase tracking-widest text-[10px]">
                    {need.profiles?.trade_category?.replace(/_/g, " ") || "—"}
                  </span>
                  <span className="opacity-40">·</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {[need.profiles?.location_lga, formatState(need.profiles?.location_state)]
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </span>
                </div>
              </div>

              {need.proof_caption && (
                <p className="text-sm text-on-surface-variant line-clamp-3 italic border-l-2 border-outline-variant/50 pl-3">
                  "{need.proof_caption}"
                </p>
              )}

              <div className="flex items-center justify-between text-xs text-on-surface-variant pt-1">
                <span className="font-black text-on-surface">{formatCost(need.item_cost)}</span>
                {need.proof_submitted_at && (
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(need.proof_submitted_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 pt-3 mt-auto border-t border-outline-variant/20">
                <Button
                  onClick={() => handleApprove(need.id)}
                  disabled={loading === need.id}
                  className="h-10 rounded-full text-xs font-black bg-success text-on-success hover:bg-success/90 shadow flex-1"
                >
                  {loading === need.id && rejectingId !== need.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                      Approve
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => setRejectingId(need.id)}
                  disabled={loading === need.id}
                  variant="outline"
                  className="h-10 px-4 rounded-full text-xs font-black border-red-200 text-red-600 hover:bg-red-50"
                >
                  <XCircle className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reject reason modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full flex flex-col gap-5 shadow-2xl">
            <div>
              <h3 className="text-lg font-black text-on-surface">Reject this proof?</h3>
              <p className="text-sm text-on-surface-variant mt-1 font-medium">
                The artisan will be asked to resubmit. Tell them what's wrong so they can fix it.
              </p>
            </div>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="e.g. The photo is too blurry to identify the equipment. Please re-upload a clear shot showing the full machine."
              rows={4}
              className="w-full rounded-2xl border border-outline-variant/50 p-4 text-sm font-medium focus:outline-none focus:border-primary resize-none"
            />
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setRejectingId(null)
                  setRejectReason("")
                }}
                className="flex-1 rounded-full"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRejectConfirm}
                disabled={loading === rejectingId}
                className="flex-1 rounded-full bg-red-600 hover:bg-red-700 text-white"
              >
                {loading === rejectingId ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Reject and notify"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
