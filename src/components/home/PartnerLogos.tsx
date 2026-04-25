"use client"

import * as React from "react"
import { motion } from "framer-motion"

const partners = [
  "Paystack",
  "Supabase", 
  "Flutterwave",
  "Interswitch",
  "Andela",
  "Termii"
]

export function PartnerLogos() {
  return (
    <section className="py-12 border-y overflow-hidden" style={{ background: 'var(--color-surface-container-low)', borderColor: 'var(--color-outline-variant)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold uppercase tracking-[0.2em] mb-10" style={{ color: 'var(--color-on-surface-variant)' }}>
          Trusted Infrastructure
        </p>
        
        <div className="relative flex overflow-hidden">
          {/* Fading edges for a premium look */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-[var(--color-surface-container-low)] to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-[var(--color-surface-container-low)] to-transparent" />
          
          <motion.div
            className="flex min-w-max items-center gap-16 pr-16"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 20,
            }}
          >
            {[...partners, ...partners].map((partner, index) => (
              <span 
                key={`${partner}-${index}`} 
                className="text-2xl md:text-3xl font-bold tracking-tighter transition-opacity hover:opacity-80 cursor-pointer" 
                style={{ color: 'var(--color-on-surface)', opacity: 0.4 }}
              >
                {partner}.
              </span>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  )
}