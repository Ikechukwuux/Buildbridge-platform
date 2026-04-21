"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ImpactCard } from "./ImpactCard"
import { type ImpactWallSubmission, type Profile } from "@/types"
import { Camera } from "lucide-react"

interface ImpactGridProps {
  submissions: (ImpactWallSubmission & { profile: Profile })[]
}

export function ImpactGrid({ submissions }: ImpactGridProps) {
  if (submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-6">
        <div 
          className="w-20 h-20 rounded-3xl flex items-center justify-center"
          style={{ background: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' }}
        >
          <Camera className="h-10 w-10" />
        </div>
        <h3 className="text-2xl font-black" style={{ color: 'var(--color-on-surface)' }}>
          The wall of success is being built...
        </h3>
        <p className="text-base font-medium max-w-md" style={{ color: 'var(--color-on-surface-variant)' }}>
          As tradespeople complete their funded projects, their stories will appear here. Be the first to back a tradesperson and help fill this wall.
        </p>
        <a 
          href="/browse" 
          className="inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-3.5 rounded-full text-base font-black tracking-wide shadow-lg hover:shadow-xl transition-all"
        >
          Browse Active Needs
        </a>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {submissions.map((submission, index) => {
        return (
          <motion.div
            key={submission.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <ImpactCard submission={submission} />
          </motion.div>
        )
      })}
    </div>
  )
}
