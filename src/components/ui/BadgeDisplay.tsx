"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Badge, type BadgeLevelType } from "./Badge"
import { Card } from "./Card"
import { Info, ShieldCheck, Star, User, Lock, ArrowRight } from "lucide-react"

export function BadgeDisplay() {
  const levels: { level: BadgeLevelType; criteria: string; impact: string }[] = [
    { 
      level: 0, 
      criteria: "Signed up to BuildBridge.", 
      impact: "Can browse needs and follow tradespeople." 
    },
    { 
      level: 1, 
      criteria: "Onboarding & Profile photo added.", 
      impact: "Can create first funding request (Need)." 
    },
    { 
      level: 2, 
      criteria: "2 Community vouches verified.", 
      impact: "Higher visibility in the Browse feed." 
    },
    { 
      level: 3, 
      criteria: "1 Need fully funded & Proof-of-use uploaded.", 
      impact: "Eligible for larger grant amounts." 
    },
    { 
      level: 4, 
      criteria: "Biometric Government ID (NIN) verified.", 
      impact: "Priority funding & Instant payout status." 
    },
  ]

  return (
    <div className="flex flex-col gap-12">
      {/* Section Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center flex flex-col items-center gap-4"
      >
        <div 
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest"
          style={{ background: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' }}
        >
          <Info className="h-3.5 w-3.5" />
          Trust System
        </div>
        <h2 className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: 'var(--color-on-surface)' }}>
          The Trust Ladder
        </h2>
        <p className="text-lg font-medium max-w-2xl" style={{ color: 'var(--color-on-surface-variant)' }}>
          Every person on this wall has been verified across multiple trust tiers. Here&apos;s how the system works.
        </p>
      </motion.div>

      {/* Badge Cards */}
      <div className="flex flex-wrap justify-center gap-6">
        {levels.map((item, index) => (
          <motion.div
            key={item.level}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="flex-1 min-w-[280px] lg:min-w-[300px] max-w-[450px]"
          >
            <Card className="p-5 flex flex-col gap-4 bg-white border-outline-variant/30 hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 group shadow-sm h-full rounded-[1.5rem]">
               <div className="flex items-center justify-between">
                 <Badge level={item.level} />
                 <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/5 text-primary">
                    <span className="text-xs font-black">{item.level}</span>
                 </div>
               </div>
               <div className="flex flex-col gap-1.5">
                  <p className="text-[10px] uppercase font-black tracking-widest" style={{ color: 'var(--color-on-surface-variant)' }}>Criteria</p>
                  <p className="text-sm font-bold leading-snug" style={{ color: 'var(--color-on-surface)' }}>{item.criteria}</p>
               </div>
               <div 
                 className="p-3 rounded-xl mt-auto"
                 style={{ background: 'var(--color-surface-container)' }}
               >
                  <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: 'var(--color-primary)' }}>
                    <ArrowRight className="h-3 w-3 inline mr-1" />Impact
                  </p>
                  <p className="text-xs font-medium leading-snug" style={{ color: 'var(--color-on-surface-variant)' }}>{item.impact}</p>
               </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
