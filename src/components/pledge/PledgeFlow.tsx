"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Card } from "@/components/ui/Card"
import { 
  ChevronRight, ChevronLeft, CheckCircle2, MessageSquare, Info,
  Zap, Lock, ArrowRight, Heart
} from "lucide-react"
import { cn } from "@/lib/utils"
import Script from "next/script"
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
  
  const [step, setStep] = useState(0) // 0: Selection, 1: Breakdown/Tip, 2: Message/Prefs, 3: Success
  const [pledgeAmount, setPledgeAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState("")
  const [message, setMessage] = useState("")
  const [tipPercentage, setTipPercentage] = useState(10) // 0 to 30
  
  const [prefs, setPrefs] = useState({
    anonymous: false,
    newsletter: true,
    contact_ok: true
  })

  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [showFlow, setShowFlow] = useState(alwaysShow)

  // Auth check - Not required for backing anymore! Guests can back.
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

  // Cost calculations
  const amountKobo = pledgeAmount || 0
  const tipKobo = Math.floor(amountKobo * (tipPercentage / 100))
  const totalChargeKobo = amountKobo + tipKobo

  const formatNGN = (kobo: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(kobo / 100)
  }

  const handlePaystackPayment = () => {
    if (!(window as any).PaystackPop) {
      alert("Payment service is still loading. Please try again.")
      return
    }

    setLoading(true)

    const handler = (window as any).PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_placeholder",
      email: user?.email || "anonymous_backer@buildbridge.org",
      amount: totalChargeKobo,
      currency: "NGN",
      metadata: {
        need_id: needId,
        backer_user_id: user?.id || 'guest',
        custom_fields: [
          { display_name: "Need Name", variable_name: "need_name", value: needName },
          { display_name: "Tradesperson", variable_name: "tradesperson", value: tradespersonName },
          { display_name: "Tip Amount", variable_name: "tip_amount", value: formatNGN(tipKobo) },
          { display_name: "Anonymous", variable_name: "is_anonymous", value: prefs.anonymous ? 'yes' : 'no' }
        ]
      },
      callback: (response: any) => {
        setStep(3) 
        setLoading(false)
      },
      onClose: () => {
        setLoading(false)
      }
    })

    handler.openIframe()
  }

  if (!showFlow) {
    return (
      <Link href={`/payment/${needId}`} className="block">
        <Button className="w-full text-headline-small py-8 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-white bg-primary">
          Back This Tradesperson
        </Button>
      </Link>
    )
  }

  return (
    <div className="bg-white p-6 rounded-3xl shadow-2xl border border-outline-variant/30 relative">
      <Script src="https://js.paystack.co/v1/inline.js" strategy="lazyOnload" />
      
      <AnimatePresence mode="wait">
        {step === 3 ? (
          <PledgeSuccess key="success" amount={amountKobo} tradespersonName={tradespersonName} needId={needId} />
        ) : (
          <motion.div key="flow" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
               {step > 0 && (
                 <button onClick={() => setStep(step - 1)} className="p-2 rounded-full hover:bg-surface-variant transition-colors group">
                    <ChevronLeft className="h-5 w-5 text-on-surface-variant group-hover:text-primary" />
                 </button>
               )}
               <p className="text-[10px] font-black uppercase text-primary tracking-widest text-right flex-grow">
                 Pledge {step + 1} of 3
               </p>
            </div>

            {/* Step 1: Selection */}
            {step === 0 && (
              <div className="flex flex-col gap-6">
                 <div>
                    <h2 className="text-2xl font-black text-on-surface">Choose your pledge</h2>
                    <p className="text-sm font-medium text-on-surface-variant">Your contribution is held securely in active escrow.</p>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    {QUICK_AMOUNTS.map(amt => (
                      <button key={amt} onClick={() => handleAmountSelect(amt)} className="h-16 rounded-[1.5rem] border-2 border-outline-variant hover:border-primary hover:bg-primary/5 text-lg font-black text-on-surface transition-all active:scale-95">
                        {formatNGN(amt * 100)}
                      </button>
                    ))}
                 </div>
                 
                 <div className="flex items-center gap-4 py-2 opacity-50">
                    <div className="flex-1 border-t border-outline-variant"></div>
                    <span className="text-xs font-black uppercase tracking-widest">or</span>
                    <div className="flex-1 border-t border-outline-variant"></div>
                 </div>

                 <div className="flex flex-col gap-3">
                    <Input 
                       placeholder="Enter custom amount (₦)"
                       value={customAmount}
                       onChange={(e) => {
                          const clean = e.target.value.replace(/[^0-9]/g, "")
                          if (clean) setCustomAmount(new Intl.NumberFormat("en-NG").format(parseInt(clean)))
                          else setCustomAmount("")
                       }}
                       className="h-16 text-center text-2xl font-black rounded-[1.5rem] border-2 border-outline-variant focus:border-primary"
                    />
                    <Button onClick={handleCustomSubmit} disabled={!customAmount} className="h-16 rounded-[1.5rem] text-lg font-bold w-full transition-all active:scale-95">
                       Continue
                    </Button>
                 </div>
              </div>
            )}

            {/* Step 2: Tip slider & Breakdown */}
            {step === 1 && (
              <div className="flex flex-col gap-6">
                 <div>
                    <h2 className="text-2xl font-black text-on-surface">Pledge Breakdown</h2>
                    <p className="text-sm font-medium text-on-surface-variant mb-6">BuildBridge charges 0% fees to tradespeople. What you pledge is exactly what they get.</p>
                 </div>

                 <div className="bg-primary/5 border border-primary/20 rounded-[2rem] p-6 flex justify-between items-center">
                    <div>
                       <span className="text-xs font-black uppercase tracking-widest text-primary block mb-1">To {tradespersonName}</span>
                       <span className="text-3xl font-black text-on-surface">{formatNGN(amountKobo)}</span>
                    </div>
                 </div>

                 {/* Tip Selector */}
                 <div className="mt-4 flex flex-col gap-4">
                    <div className="flex justify-between items-end">
                       <h3 className="font-bold text-sm uppercase tracking-widest text-on-surface-variant">Support the Platform (Optional)</h3>
                       <span className="font-black text-primary text-xl">{tipPercentage}%</span>
                    </div>
                    <p className="text-xs font-medium text-on-surface-variant mb-2">We rely on optional tips from backers to keep the platform free for artisans.</p>
                    
                    <input 
                       type="range" min="0" max="30" step="5"
                       value={tipPercentage}
                       onChange={(e) => setTipPercentage(parseInt(e.target.value))}
                       className="w-full h-2 bg-surface-variant rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    
                    <div className="flex justify-between text-xs font-bold text-on-surface-variant/50 pt-2">
                       <span>0%</span>
                       <span>15%</span>
                       <span>30%</span>
                    </div>
                 </div>

                 {tipPercentage === 0 && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-badge-3/10 border border-badge-3/20 rounded-2xl p-4 flex gap-4 mt-2">
                       <Heart className="h-6 w-6 text-badge-3 flex-shrink-0" />
                       <p className="text-xs font-medium text-on-surface-variant leading-relaxed">
                          We don't charge tradespeople anything. A small tip from you is the only way we cover payment processing and escrow operations. Thank you for considering it!
                       </p>
                    </motion.div>
                 )}

                 <div className="bg-surface-variant/20 rounded-[2rem] p-6 flex justify-between items-center border border-outline-variant/30 mt-4">
                    <span className="font-bold text-sm uppercase tracking-widest text-on-surface">Total Charge</span>
                    <span className="text-2xl font-black text-on-surface">{formatNGN(totalChargeKobo)}</span>
                 </div>

                 <Button onClick={() => setStep(2)} className="w-full h-16 rounded-[1.5rem] text-lg font-bold shadow-xl active:scale-95">
                    Continue to Final Step <ArrowRight className="ml-2 h-5 w-5" />
                 </Button>
              </div>
            )}

            {/* Step 3: Prefs, Message, & Pay */}
            {step === 2 && (
              <div className="flex flex-col gap-6">
                 <div>
                    <h2 className="text-2xl font-black text-on-surface">Final Details</h2>
                    <p className="text-sm font-medium text-on-surface-variant">Add a word of encouragement to {tradespersonName}.</p>
                 </div>
                 
                 <Textarea 
                    placeholder="e.g. Keep up the great work! I believe in your craft."
                    className="min-h-[120px] rounded-[1.5rem] border-2 border-outline-variant p-5 focus:border-primary"
                    value={message}
                    onChange={(e) => setMessage(e.target.value.slice(0, 500))}
                 />

                 <div className="flex flex-col gap-4 mt-2 bg-surface-variant/10 p-5 rounded-3xl border border-outline-variant/30">
                    <label className="flex items-center gap-4 cursor-pointer group">
                       <input type="checkbox" checked={prefs.anonymous} onChange={e => setPrefs({...prefs, anonymous: e.target.checked})} className="h-6 w-6 rounded border-outline-variant text-primary focus:ring-primary"/>
                       <span className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">Make my pledge anonymous</span>
                    </label>
                    <label className="flex items-center gap-4 cursor-pointer group">
                       <input type="checkbox" checked={prefs.newsletter} onChange={e => setPrefs({...prefs, newsletter: e.target.checked})} className="h-6 w-6 rounded border-outline-variant text-primary focus:ring-primary"/>
                       <span className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">Keep me updated on their progress</span>
                    </label>
                    <label className="flex flex-row items-start gap-4 cursor-pointer group">
                       <input type="checkbox" checked={prefs.contact_ok} onChange={e => setPrefs({...prefs, contact_ok: e.target.checked})} className="h-6 w-6 rounded border-outline-variant text-primary focus:ring-primary mt-1"/>
                       <span className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">Allow {tradespersonName} to send a thank you note</span>
                    </label>
                 </div>

                 <Button 
                    onClick={handlePaystackPayment} 
                    isLoading={loading} 
                    className="w-full h-20 text-xl font-black rounded-[2rem] flex items-center justify-center gap-3 bg-on-surface text-surface hover:bg-on-surface/90 shadow-2xl active:scale-95"
                 >
                    <Lock className="h-6 w-6" />
                    Pay {formatNGN(totalChargeKobo)} Securely
                 </Button>
              </div>
            )}
            
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
