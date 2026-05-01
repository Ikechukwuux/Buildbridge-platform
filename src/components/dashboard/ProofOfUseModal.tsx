"use client"

import * as React from "react"
import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/Textarea"
import { submitProofOfUseAction } from "@/app/actions/proof"
import {
  Camera,
  CheckCircle2,
  Sparkles,
  X,
  Upload,
  Clock,
  Heart,
  ArrowRight,
  ImageIcon,
  Info,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ProofOfUseModalProps {
  needId: string
  itemName: string
  /** Days since the need was funded (used for nudge copy) */
  daysSinceFunded?: number
  onSuccess: () => void
  onClose: () => void
}

const NUDGE_COPY: Record<number, { title: string; body: string; urgency: "low" | "medium" | "high" }> = {
  3: {
    title: "Day 3 — Your backers are watching! 👀",
    body: "The community that funded you is waiting to see what their pledge enabled. A quick photo goes a long way.",
    urgency: "low",
  },
  7: {
    title: "Day 7 — A week has passed 🕐",
    body: "Your backers sent you funds a week ago. Share your proof update to keep their trust and unlock the Impact Wall.",
    urgency: "medium",
  },
  14: {
    title: "Day 14 — Final nudge! ⚠️",
    body: "This is your last reminder. Not submitting proof by Day 21 will flag your account and require manual approval for future needs.",
    urgency: "high",
  },
}

function getNudgeTier(days: number) {
  if (days >= 14) return NUDGE_COPY[14]
  if (days >= 7) return NUDGE_COPY[7]
  if (days >= 3) return NUDGE_COPY[3]
  return null
}

export function ProofOfUseModal({
  needId,
  itemName,
  daysSinceFunded = 0,
  onSuccess,
  onClose,
}: ProofOfUseModalProps) {
  const [step, setStep] = useState(0) // 0: Intro, 1: Upload, 2: Success
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [caption, setCaption] = useState("")
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const nudge = getNudgeTier(daysSinceFunded)

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be under 10MB.")
      return
    }
    setPhotoFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setError(null)
  }, [])

  const handleSubmit = async () => {
    if (!caption || caption.length < 10) {
      setError("Please write a caption describing what you bought and how it helps (at least 10 characters).")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("need_id", needId)
      formData.append("proof_caption", caption)
      if (photoFile) {
        formData.append("proof_photo", photoFile)
      }

      const result = await submitProofOfUseAction(formData)

      if (result.success) {
        setStep(2)
      } else {
        setError(result.error || "Failed to submit proof.")
      }
    } catch {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between sticky top-0 bg-surface z-10 pb-2">
        <div className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-primary" />
          <span className="text-label-large font-black uppercase tracking-widest text-primary">
            Proof of Purchase
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-surface-variant/50 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <AnimatePresence mode="wait">

        {/* ── Step 0: Intro / Why This Matters ── */}
        {step === 0 && (
          <motion.div
            key="step-0"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-6"
          >
            {/* Nudge Banner */}
            {nudge && (
              <div
                className={cn(
                  "p-4 rounded-2xl border flex gap-3 items-start",
                  nudge.urgency === "high"
                    ? "bg-error/5 border-error/30 text-error"
                    : nudge.urgency === "medium"
                    ? "bg-amber-500/5 border-amber-500/30 text-amber-700"
                    : "bg-primary/5 border-primary/20 text-primary"
                )}
              >
                {nudge.urgency === "high" ? (
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                ) : (
                  <Clock className="h-5 w-5 shrink-0 mt-0.5" />
                )}
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-black">{nudge.title}</p>
                  <p className="text-xs font-medium opacity-80">{nudge.body}</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <h2 className="text-display-small font-black text-on-surface leading-tight">
                Share what you <span className="text-primary italic">built.</span>
              </h2>
              <p className="text-body-large text-on-surface-variant">
                Your backers funded <strong>{itemName}</strong>. Upload a photo of your purchase and tell
                them how it has helped your trade. This closes the loop and builds community trust.
              </p>
            </div>

            {/* Trust benefits */}
            <div className="grid grid-cols-1 gap-3">
              {[
                { icon: Heart, text: "All your backers get notified immediately" },
                { icon: Sparkles, text: "Your profile earns a permanent 'Delivered' badge" },
                { icon: CheckCircle2, text: "Unlocks your story for the public Impact Wall" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 p-3 bg-surface-variant/20 rounded-2xl">
                  <Icon className="h-5 w-5 text-primary shrink-0" />
                  <p className="text-sm font-medium text-on-surface-variant">{text}</p>
                </div>
              ))}
            </div>

            <Button
              onClick={() => setStep(1)}
              className="h-14 rounded-2xl text-title-medium flex items-center gap-2"
            >
              Upload Proof
              <ArrowRight className="h-5 w-5" />
            </Button>
          </motion.div>
        )}

        {/* ── Step 1: Upload Photo + Caption ── */}
        {step === 1 && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-6"
          >
            <div className="space-y-1">
              <h3 className="text-headline-small font-black text-on-surface">
                Upload your proof photo
              </h3>
              <p className="text-body-medium text-on-surface-variant">
                Show the item you purchased. A clear photo with the item in use works best.
              </p>
            </div>

            {/* Photo Upload Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "relative border-2 border-dashed rounded-3xl cursor-pointer overflow-hidden transition-all",
                previewUrl
                  ? "border-primary/30"
                  : "border-outline-variant hover:border-primary/50 hover:bg-primary/5"
              )}
              style={{ minHeight: 180 }}
            >
              {previewUrl ? (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Proof preview"
                    className="w-full object-cover rounded-3xl"
                    style={{ maxHeight: 260 }}
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-3xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-white font-black text-sm bg-black/50 px-4 py-2 rounded-full">
                      Click to change photo
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-on-surface-variant">
                  <div className="h-16 w-16 rounded-full bg-surface-variant flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 opacity-50" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-sm">Click to upload a photo</p>
                    <p className="text-xs opacity-60 mt-1">JPG, PNG, WEBP · Max 10MB</p>
                  </div>
                  <button
                    type="button"
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-full text-sm font-bold hover:bg-primary/90 transition-colors"
                  >
                    <Upload className="h-4 w-4" />
                    Choose Photo
                  </button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                className="sr-only"
                onChange={handleFileChange}
              />
            </div>

            {/* Caption */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-black text-on-surface uppercase tracking-widest">
                Success Caption *
              </label>
              <Textarea
                placeholder={`e.g. "I bought a new ${itemName}. My output has doubled and customers are already noticing the difference!"`}
                className="min-h-[100px] text-body-large rounded-2xl"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                autoFocus
              />
              <div className="flex items-center justify-between">
                <p className={cn(
                  "text-xs font-bold",
                  caption.length < 10 ? "text-on-surface-variant" : "text-primary"
                )}>
                  {caption.length} characters {caption.length < 10 && "(minimum 10)"}
                </p>
                <p className="text-xs text-on-surface-variant">Max 500</p>
              </div>
            </div>

            {/* Info note */}
            <div className="p-3 rounded-xl bg-surface-variant/20 flex gap-2">
              <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-on-surface-variant">
                Photo is optional but strongly recommended — needs with photos get 3x more repeat backers.
              </p>
            </div>

            {error && (
              <p className="text-sm font-bold text-error flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </p>
            )}

            <div className="flex gap-4">
              <Button
                variant="ghost"
                onClick={() => setStep(0)}
                className="flex-1 h-14 rounded-2xl"
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                isLoading={loading}
                className="flex-[2] h-14 rounded-2xl text-title-medium"
              >
                {loading ? "Submitting..." : "Submit Proof"}
              </Button>
            </div>
          </motion.div>
        )}

        {/* ── Step 2: Success ── */}
        {step === 2 && (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-6 text-center gap-6"
          >
            {/* Celebration */}
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: [0.5, 1.2, 1.0] }}
              transition={{ duration: 0.5, times: [0, 0.6, 1] }}
              className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-badge-2 text-white flex items-center justify-center shadow-2xl shadow-primary/30"
            >
              <CheckCircle2 className="h-12 w-12" />
            </motion.div>

            <div className="space-y-3">
              <h3 className="text-headline-large font-black text-on-surface">
                Proof Submitted! 🎉
              </h3>
              <p className="text-body-large text-on-surface-variant max-w-xs mx-auto">
                Your backers have been notified. Your profile has earned a{" "}
                <strong className="text-primary">Delivered</strong> badge — a mark of trust on BuildBridge.
              </p>
            </div>

            {/* Impact Wall Prompt */}
            <div className="w-full p-5 bg-primary/5 border border-primary/20 rounded-2xl text-left flex flex-col gap-3">
              <p className="text-sm font-black text-on-surface">
                ✨ Would you like your story on the Impact Wall?
              </p>
              <p className="text-xs text-on-surface-variant font-medium">
                The Impact Wall is a public showcase — your story could inspire the next tradesperson to ask for help and the next backer to give.
              </p>
              <Button
                isLoading={loading}
                onClick={async () => {
                  setLoading(true)
                  try {
                    const impactFormData = new FormData()
                    impactFormData.append("need_id", needId)
                    impactFormData.append("caption", caption) // using the same caption they just wrote
                    impactFormData.append("public_display_consent", "on")
                    
                    // Import dynamically or ensure submitToImpactWallAction is available
                    const { submitToImpactWallAction } = await import("@/app/actions/impact")
                    await submitToImpactWallAction(impactFormData)
                  } catch (err) {
                    console.error("Failed to auto-submit to impact wall", err)
                  } finally {
                    setLoading(false)
                    onSuccess()
                    onClose()
                  }
                }}
                className="w-full h-12 rounded-xl text-sm font-black"
              >
                {loading ? "Sharing..." : "Share on Impact Wall"}
              </Button>
            </div>

            <button
              onClick={() => { onSuccess(); onClose() }}
              className="text-sm text-on-surface-variant hover:text-primary transition-colors font-medium"
            >
              Skip for now — Go to Dashboard
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
