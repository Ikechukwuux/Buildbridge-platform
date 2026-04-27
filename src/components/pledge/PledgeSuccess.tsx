"use client"

import * as React from "react"
import { useEffect } from "react"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"
import { Button } from "@/components/ui/Button"
import { CheckCircle2, Heart, Share2, ArrowRight } from "lucide-react"
import Link from "next/link"
import { handleShare } from "@/lib/utils"

interface PledgeSuccessProps {
  amount: number
  tradespersonName: string
  needId: string
}

export function PledgeSuccess({ amount, tradespersonName, needId }: PledgeSuccessProps) {
  useEffect(() => {
    const duration = 2 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now()
      if (timeLeft <= 0) return clearInterval(interval)
      const particleCount = 50 * (timeLeft / duration)
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } })
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } })
    }, 250)

    return () => clearInterval(interval)
  }, [])

  const formattedAmount = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount / 100)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-between h-[calc(100vh-2rem)] max-h-[600px] py-8 px-6 text-center"
    >
      {/* Top: Icon + Title */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="h-16 w-16 rounded-2xl flex items-center justify-center shadow-lg shadow-success/20"
            style={{ background: "var(--color-success)" }}
          >
            <CheckCircle2 className="h-8 w-8" style={{ color: "var(--color-on-success)" }} />
          </motion.div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="absolute -top-1.5 -right-1.5 h-6 w-6 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md"
          >
            <Heart className="h-3 w-3 fill-on-primary" />
          </motion.div>
        </div>

        <div className="flex flex-col gap-0.5">
          <h2 className="text-xl font-black text-on-surface">
            Pledge{" "}
            <span style={{ color: "var(--color-success)" }}>Confirmed!</span>
          </h2>
          <p className="text-sm text-on-surface-variant max-w-xs mx-auto font-medium leading-snug">
            You just pledged <span className="text-on-surface font-black">{formattedAmount}</span> to back{" "}
            <span className="text-on-surface font-black">{tradespersonName}</span>
          </p>
        </div>
      </div>

      {/* Middle: Escrow */}
      <div className="p-3 bg-surface rounded-xl border border-outline-variant/40 max-w-xs w-full shadow-sm">
        <p className="text-[10px] uppercase font-black text-on-surface-variant/50 tracking-widest mb-0.5">
          Escrow Protected
        </p>
        <p className="text-xs text-on-surface-variant italic leading-relaxed">
          Funds are held in escrow — released only when proof of purchase is confirmed.
        </p>
      </div>

      {/* Bottom: Actions */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleShare(
              `I just backed ${tradespersonName}!`,
              `Support ${tradespersonName}'s need on BuildBridge and help build pockets of trust!`,
              `/needs/${needId}`
            )
          }}
          className="w-full gap-2 h-12 text-sm font-black shadow-sm"
          variant="secondary"
        >
          <Share2 className="h-4 w-4" />
          Share the Impact
        </Button>
        <Link href="/browse" className="w-full">
          <Button className="w-full gap-2 h-12 text-sm font-black shadow-lg bg-primary text-white">
            Support Someone Else
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">
          BuildBridge
        </p>
      </div>
    </motion.div>
  )
}
