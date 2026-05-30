"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, X, Trash2, Loader2, ShieldCheck, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import {
  requestAccountDeletion,
  getMyDeletionRequest,
  cancelMyDeletionRequest,
} from "@/app/actions/account-deletion"

type Phase = "idle" | "submitting" | "submitted" | "error"

export function DeleteAccountDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [confirmText, setConfirmText] = React.useState("")
  const [reason, setReason] = React.useState("")
  const [phase, setPhase] = React.useState<Phase>("idle")
  const [error, setError] = React.useState<string | null>(null)
  const [existing, setExisting] = React.useState<{ id: string; requested_at: string } | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    if (!isOpen) return
    let cancelled = false
    const run = async () => {
      setLoading(true)
      const data = await getMyDeletionRequest()
      if (!cancelled) {
        setExisting(data as any)
        setLoading(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [isOpen])

  const handleSubmit = async () => {
    if (confirmText.trim().toUpperCase() !== "DELETE") {
      setError("Type DELETE to confirm.")
      return
    }
    setPhase("submitting")
    setError(null)
    const res = await requestAccountDeletion(reason)
    if (!res.success) {
      setPhase("error")
      setError(res.error || "Couldn't submit your request.")
      return
    }
    setPhase("submitted")
  }

  const handleCancelRequest = async () => {
    if (!existing) return
    setLoading(true)
    const res = await cancelMyDeletionRequest(existing.id)
    if (res.success) {
      setExisting(null)
    }
    setLoading(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-on-surface/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="px-8 pt-8 pb-6 flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-error/10 text-error flex items-center justify-center shrink-0">
                  <Trash2 className="h-6 w-6" />
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-2xl font-black text-on-surface tracking-tight">
                    {existing ? "Deletion request pending" : "Delete your account"}
                  </h2>
                  <p className="text-sm text-on-surface-variant font-medium">
                    {existing
                      ? "We received your request and will process it within 30 days."
                      : "This will remove your personal data from BuildBridge."}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-on-surface-variant hover:bg-surface-variant/40 rounded-full p-1.5 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-8 pb-8 flex flex-col gap-5">
              {loading ? (
                <div className="h-24 flex items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-on-surface-variant/50" />
                </div>
              ) : existing ? (
                <>
                  <div className="rounded-2xl bg-amber-50 border border-amber-200 p-5 flex gap-3">
                    <ShieldCheck className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-black text-amber-900">
                        Status: Pending review
                      </p>
                      <p className="text-xs text-amber-800 font-medium leading-relaxed">
                        Requested {new Date(existing.requested_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}. Your account remains active until processed.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="outline"
                      onClick={handleCancelRequest}
                      className="flex-1 h-12 rounded-full font-black"
                    >
                      Cancel request
                    </Button>
                    <Button onClick={onClose} className="flex-1 h-12 rounded-full font-black">
                      Close
                    </Button>
                  </div>
                </>
              ) : phase === "submitted" ? (
                <div className="flex flex-col items-center gap-4 text-center py-4">
                  <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-black text-on-surface">Request submitted</h3>
                    <p className="text-sm text-on-surface-variant font-medium max-w-sm leading-relaxed">
                      We'll remove your personal data within 30 days as required by NDPA 2023. You'll receive a confirmation email when it's complete.
                    </p>
                  </div>
                  <Button onClick={onClose} className="h-12 px-8 rounded-full font-black mt-2">
                    Close
                  </Button>
                </div>
              ) : (
                <>
                  <div className="rounded-2xl bg-error/5 border border-error/20 p-5 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-error">
                      <AlertTriangle className="h-4 w-4" />
                      <p className="text-xs font-black uppercase tracking-widest">What gets deleted</p>
                    </div>
                    <ul className="text-sm font-medium text-on-surface-variant leading-relaxed list-disc pl-5 space-y-1">
                      <li>Your profile, photos, story, and contact details</li>
                      <li>Verification records (NIN/BVN hashes)</li>
                      <li>Account login credentials</li>
                    </ul>
                    <p className="text-xs text-on-surface-variant/70 font-medium pt-1">
                      Pledge and donation history is anonymised but retained for financial-record obligations.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
                      Reason for leaving (optional)
                    </label>
                    <textarea
                      value={reason}
                      onChange={e => setReason(e.target.value)}
                      placeholder="Tell us what didn't work — we read every response."
                      rows={3}
                      className="w-full rounded-2xl border border-outline-variant/50 p-4 text-sm font-medium focus:outline-none focus:border-primary resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
                      Type <span className="text-error">DELETE</span> to confirm
                    </label>
                    <input
                      value={confirmText}
                      onChange={e => setConfirmText(e.target.value)}
                      placeholder="DELETE"
                      className="w-full h-12 rounded-2xl border border-outline-variant/50 px-4 text-sm font-black tracking-widest focus:outline-none focus:border-error"
                      autoComplete="off"
                    />
                  </div>

                  {error && (
                    <p className="text-sm font-bold text-error flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      {error}
                    </p>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                      variant="outline"
                      onClick={onClose}
                      className="flex-1 h-12 rounded-full font-black"
                    >
                      Keep my account
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={phase === "submitting" || confirmText.trim().toUpperCase() !== "DELETE"}
                      className="flex-1 h-12 rounded-full font-black bg-error text-white hover:bg-error/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {phase === "submitting" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Request deletion"
                      )}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
