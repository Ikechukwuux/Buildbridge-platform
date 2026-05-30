"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import {
  ChevronRight, ChevronLeft, CheckCircle2, ArrowRight, Lock, Zap
} from "lucide-react"
import { cn } from "@/lib/utils"
import { PledgeSuccess } from "./PledgeSuccess"
import { createClient } from "@/lib/supabase/client"

interface PledgeFlowProps {
  needId: string
  needName: string
  tradespersonName: string
  goalAmount: number
  alwaysShow?: boolean
}

const QUICK_AMOUNTS = [5000, 10000, 20000, 50000]

export function PledgeFlow({ needId, needName, tradespersonName, goalAmount, alwaysShow = false }: PledgeFlowProps) {
  const router = useRouter()
  const supabase = createClient()

  const [step, setStep] = useState(0) // 0: Selection, 1: Breakdown, 2: Message/Prefs, 3: Success
  const [pledgeAmount, setPledgeAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState("")
  const [message, setMessage] = useState("")
  const PLATFORM_FEE_RATE = 0.03

  const [prefs, setPrefs] = useState({
    anonymous: false,
    newsletter: true,
    contact_ok: true
  })

  const [loading, setLoading] = useState(false)
  const [paystackReady, setPaystackReady] = useState(false)
  const [paystackError, setPaystackError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [showFlow, setShowFlow] = useState(alwaysShow)
  const scriptFormRef = useRef<HTMLFormElement>(null)

  // Load Paystack script into a hidden form (script requires a parent form element)
  useEffect(() => {
    if (!scriptFormRef.current) return
    const script = document.createElement("script")
    script.src = "https://js.paystack.co/v1/inline.js"
    script.onload = () => {
      console.log("[Paystack] Script loaded")
      setPaystackReady(true)
    }
    script.onerror = () => console.error("Failed to load Paystack script")
    scriptFormRef.current.appendChild(script)
    return () => {
      if (script.parentNode) script.parentNode.removeChild(script)
    }
  }, [])

  // Auth check
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    checkUser()
  }, [])

  const handleStartPledge = () => {
    setShowFlow(true)
  }

  const handleAmountSelect = (naira: number) => {
    setPledgeAmount(naira * 100)
    setStep(1)
  }

  const handleCustomSubmit = () => {
    const naira = parseInt(customAmount.replace(/[^0-9]/g, ""))
    if (naira > 0) {
      setPledgeAmount(naira * 100)
      setStep(1)
    }
  }

  // Cost calculations — 3% platform fee deducted from pledge
  const amountKobo = pledgeAmount || 0
  const feeKobo = Math.floor(amountKobo * PLATFORM_FEE_RATE)
  const artisanKobo = amountKobo - feeKobo

  const formatNGN = (kobo: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(kobo / 100)

  const handlePaystackPayment = () => {
    setPaystackError(null)

    if (!(window as any).PaystackPop) {
      setPaystackError("Payment service not loaded yet. Please wait a moment and try again.")
      return
    }

    const key = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_placeholder"
    const email = user?.email || "anonymous_backer@buildbridge.org"

    console.log("[Paystack] Opening with key:", key.substring(0, 15) + "...", "amount:", amountKobo, "email:", email)

    setLoading(true)

    // Safety timeout — reset loading if popup doesn't respond within 60s
    const timeout = setTimeout(() => {
      setLoading(false)
      setPaystackError("Payment window timed out. Please try again.")
    }, 60000)

    try {
      const handler = (window as any).PaystackPop.setup({
        key,
        email,
        amount: amountKobo,
        ref: `bb_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        currency: "NGN",
        channels: ["card", "bank", "ussd", "bank_transfer"],
        metadata: {
          need_id: needId,
          backer_user_id: user?.id || 'guest',
          pledge_kobo: artisanKobo,  // artisan's portion (97%)
          fee_kobo: feeKobo,         // BuildBridge platform fee (3%)
        },
        callback: function (response: any) {
          clearTimeout(timeout)
          console.log("[Paystack] Payment successful, ref:", response.reference)
          setStep(3)
          setLoading(false)

          if (response.reference) {
            // Use an async IIFE — Paystack v1 requires a plain function, not async function
            ;(async () => {
              try {
                const verifyRes = await fetch("/api/payment/verify", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    reference: response.reference,
                    need_id: needId,
                    message: message.slice(0, 500) || undefined,
                    fee_kobo: feeKobo,
                  }),
                })
                const verifyData = await verifyRes.json()
                if (!verifyData.success) {
                  console.error("[PledgeFlow] Verification failed:", verifyData.error)
                } else {
                  console.log("[PledgeFlow] Pledge verified and recorded ✓")
                }
              } catch (err) {
                console.error("[PledgeFlow] Verify request failed:", err)
              }
            })()
          }
        },
        onClose: function () {
          clearTimeout(timeout)
          console.log("[Paystack] Payment window closed by user")
          setLoading(false)
        }
      })

      console.log("[Paystack] Calling openIframe...")
      handler.openIframe()
      console.log("[Paystack] openIframe called successfully")
    } catch (err: any) {
      clearTimeout(timeout)
      console.error("[Paystack] Setup failed:", err)
      setLoading(false)
      setPaystackError(err?.message || "Could not open payment window. Please try again.")
    }
  }

  if (!showFlow) {
    return (
      <Button
        onClick={() => router.push(`/payment/${needId}`)}
        className="w-full text-headline-small py-8 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-white bg-primary"
      >
        Donate to This Tradesperson
      </Button>
    )
  }

  // Step labels for progress indicator
  const STEP_LABELS = ["Amount", "Breakdown", "Details"]

  return (
    <>
      <form ref={scriptFormRef} style={{ display: "none" }} />
      <div className="relative">

      <AnimatePresence mode="wait">
        {step === 3 ? (
          <PledgeSuccess key="success" amount={amountKobo} tradespersonName={tradespersonName} needId={needId} />
        ) : (
          <motion.div
            key="flow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col"
          >
            {/* Progress bar header */}
            <div className="px-8 pt-8 pb-6 border-b border-outline-variant/20">
              <div className="flex items-center justify-between mb-4">
                {step > 0 ? (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="p-2 rounded-full hover:bg-surface-variant/50 transition-colors group"
                  >
                    <ChevronLeft className="h-5 w-5 text-on-surface-variant group-hover:text-primary transition-colors" />
                  </button>
                ) : (
                  <div className="w-9" />
                )}
                <div className="flex items-center gap-2">
                  {STEP_LABELS.map((label, i) => (
                    <React.Fragment key={label}>
                      <div className="flex flex-col items-center gap-1">
                        <div
                          className={cn(
                            "h-2 w-8 rounded-full transition-all duration-300",
                            i <= step ? "bg-primary" : "bg-outline-variant/40"
                          )}
                        />
                        <span className={cn(
                          "text-[9px] font-black uppercase tracking-widest transition-colors",
                          i === step ? "text-primary" : "text-on-surface-variant/40"
                        )}>
                          {label}
                        </span>
                      </div>
                      {i < STEP_LABELS.length - 1 && (
                        <div className="h-px w-4 bg-outline-variant/30 mb-4" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <div className="w-9" />
              </div>
            </div>

            {/* Step content */}
            <div className="px-8 py-8 flex flex-col gap-6">

              {/* ── STEP 0: Amount selection ── */}
              {step === 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-6"
                >
                  <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-black text-on-surface">Choose your pledge</h2>
                    <p className="text-sm font-medium text-on-surface-variant leading-relaxed">
                      Your contribution is held securely and released in stages as milestones are met.
                    </p>
                  </div>

                  {/* Quick amounts */}
                  <div className="grid grid-cols-2 gap-3">
                    {QUICK_AMOUNTS.map(amt => (
                      <button
                        key={amt}
                        onClick={() => handleAmountSelect(amt)}
                        className={cn(
                          "h-16 rounded-2xl border-2 text-lg font-black transition-all active:scale-95",
                          "border-outline-variant/50 text-on-surface",
                          "hover:border-primary hover:bg-primary/5 hover:text-primary",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        )}
                      >
                        {formatNGN(amt * 100)}
                      </button>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-outline-variant/30" />
                    <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant/50">or</span>
                    <div className="flex-1 h-px bg-outline-variant/30" />
                  </div>

                  {/* Custom amount */}
                  <div className="flex flex-col gap-3">
                    <Input
                      placeholder="Enter custom amount (₦)"
                      value={customAmount}
                      onChange={(e) => {
                        const clean = e.target.value.replace(/[^0-9]/g, "")
                        if (clean) setCustomAmount(new Intl.NumberFormat("en-NG").format(parseInt(clean)))
                        else setCustomAmount("")
                      }}
                      className="h-14 text-center text-xl font-black rounded-2xl border-2 border-outline-variant/50 focus:border-primary placeholder:font-medium placeholder:text-sm placeholder:text-on-surface-variant/50"
                    />
                    <Button
                      onClick={handleCustomSubmit}
                      disabled={!customAmount}
                      className="h-14 rounded-2xl text-base font-black w-full transition-all active:scale-95 disabled:opacity-40"
                    >
                      Continue <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 1: Tip & Breakdown ── */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-6"
                >
                  <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-black text-on-surface">Pledge Breakdown</h2>
                    <p className="text-sm font-medium text-on-surface-variant leading-relaxed">
                      A small 3% platform fee keeps BuildBridge running. The remainder goes directly to {tradespersonName}.
                    </p>
                  </div>

                  {/* Amount to tradesperson */}
                  <div className="p-6 bg-primary/5 border border-primary/15 rounded-[1.75rem] flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                        To {tradespersonName} (97%)
                      </span>
                      <span className="text-3xl font-black text-on-surface">{formatNGN(artisanKobo)}</span>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Zap className="h-5 w-5" />
                    </div>
                  </div>

                  {/* Platform fee */}
                  <div className="p-5 bg-surface-variant/20 rounded-[1.75rem] border border-outline-variant/30 flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                        Platform fee (3%)
                      </span>
                      <span className="text-xs font-medium text-on-surface-variant leading-relaxed">
                        Keeps BuildBridge running and improving.
                      </span>
                    </div>
                    <span className="text-xl font-black text-on-surface">{formatNGN(feeKobo)}</span>
                  </div>

                  {/* Total */}
                  <div className="p-5 bg-on-surface/5 rounded-[1.75rem] border border-outline-variant/30 flex items-center justify-between">
                    <span className="text-sm font-black uppercase tracking-widest text-on-surface">Total Charge</span>
                    <span className="text-2xl font-black text-on-surface">{formatNGN(amountKobo)}</span>
                  </div>

                  <Button
                    onClick={() => setStep(2)}
                    className="w-full h-14 rounded-2xl text-base font-black shadow-lg shadow-primary/15 active:scale-95"
                  >
                    Continue to Final Step <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              )}

              {/* ── STEP 2: Message, Prefs & Pay ── */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-6"
                >
                  <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-black text-on-surface">Final Details</h2>
                    <p className="text-sm font-medium text-on-surface-variant">
                      Add a word of encouragement to {tradespersonName}.
                    </p>
                  </div>

                  <Textarea
                    placeholder="e.g. Keep up the great work! I believe in your craft."
                    className="min-h-[110px] rounded-2xl border-2 border-outline-variant/50 p-4 focus:border-primary resize-none text-sm font-medium"
                    value={message}
                    onChange={(e) => setMessage(e.target.value.slice(0, 500))}
                  />

                  {/* Preferences */}
                  <div className="flex flex-col gap-4 p-5 bg-surface-variant/20 rounded-[1.75rem] border border-outline-variant/30">
                    {[
                      { key: "anonymous", label: "Make my pledge anonymous" },
                      { key: "newsletter", label: "Keep me updated on their progress" },
                      { key: "contact_ok", label: `Allow ${tradespersonName} to send a thank you note` },
                    ].map(({ key, label }) => (
                      <label key={key} className="flex items-start gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={prefs[key as keyof typeof prefs]}
                          onChange={e => setPrefs({ ...prefs, [key]: e.target.checked })}
                          className="h-5 w-5 mt-0.5 rounded border-outline-variant text-primary focus:ring-primary accent-primary shrink-0"
                        />
                        <span className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors leading-relaxed">
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>

                  {paystackError && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-error/5 border border-error/20 rounded-2xl text-sm font-bold text-error text-center"
                    >
                      {paystackError}
                    </motion.div>
                  )}

                  {/* Pay button */}
                  <Button
                    onClick={handlePaystackPayment}
                    isLoading={loading}
                    disabled={!paystackReady}
                    className="w-full h-16 text-lg font-black rounded-2xl flex items-center justify-center gap-3 bg-on-surface text-surface hover:bg-on-surface/90 shadow-2xl active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Lock className="h-5 w-5" />
                    Pay {formatNGN(amountKobo)} Securely
                  </Button>

                  <p className="text-center text-xs text-on-surface-variant/50 font-medium">
                    Your payment is encrypted and processed securely via Paystack.
                  </p>
                </motion.div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </>
  )
}
