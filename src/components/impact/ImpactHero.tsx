"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Sparkles, TrendingUp, Users, Heart } from "lucide-react"

interface ImpactHeroProps {
  count: number;
}

export function ImpactHero({ count }: ImpactHeroProps) {
  const stats = [
    { icon: Users, value: "1,284", label: "Tradespeople Backed" },
    { icon: TrendingUp, value: "₦45.2M", label: "Total Funded" },
    { icon: Heart, value: `${count}+`, label: "Success Stories" },
  ]

  return (
    <section className="relative pt-32 pb-20 overflow-hidden" style={{ background: 'var(--color-surface)' }}>
      {/* Mesh background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 rounded-full opacity-[0.06]" style={{ background: 'var(--color-primary)', filter: 'blur(100px)' }} />
        <div className="absolute bottom-0 right-10 w-72 h-72 rounded-full opacity-[0.06]" style={{ background: 'var(--color-tertiary)', filter: 'blur(80px)' }} />
        <div className="absolute top-40 right-1/3 w-48 h-48 rounded-full opacity-[0.04]" style={{ background: 'var(--color-primary)', filter: 'blur(60px)' }} />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center gap-8 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest"
            style={{ background: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Direct Community Results
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-[1.1]"
            style={{ color: 'var(--color-on-surface)' }}
          >
            The{" "}
            <span className="text-primary italic decoration-yellow-400 underline decoration-4 underline-offset-8">
              Impact
            </span>{" "}
            Wall.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl font-medium leading-relaxed max-w-2xl"
            style={{ color: 'var(--color-on-surface-variant)' }}
          >
            BuildBridge is more than just funding—it&apos;s transformation. Witness the real results of backer-powered growth in local Nigerian trade across the nation.
          </motion.p>

          {/* Mini Stats Strip */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex items-center gap-6 md:gap-10 mt-4"
          >
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-2xl flex items-center justify-center"
                  style={{ background: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' }}
                >
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-lg font-black" style={{ color: 'var(--color-on-surface)' }}>{stat.value}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--color-on-surface-variant)' }}>{stat.label}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
