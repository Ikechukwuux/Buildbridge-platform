"use client"

import * as React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function ImpactCTA() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-primary relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400" />

      <div className="mx-auto max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[2.5rem] bg-white p-12 md:p-20 text-center shadow-2xl"
          style={{ boxShadow: '0 30px 60px -12px rgba(0,0,0,0.25)' }}
        >
          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-6">
            <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tight text-primary">
              Inspired by these stories?
            </h2>
            
            <p className="text-base md:text-lg text-primary/70 max-w-xl font-medium leading-relaxed">
              Every pledge creates another success story. Back a tradesperson today and be part of the next transformation on this wall.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link 
                  href="/browse" 
                  className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-3.5 rounded-full text-base font-black tracking-wide shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Back a Tradesperson
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
              <Link 
                href="/onboarding"
                className="inline-flex items-center justify-center gap-2 text-primary border-2 border-primary/20 px-8 py-3.5 rounded-full text-base font-black tracking-wide hover:bg-primary/5 transition-all duration-300"
              >
                Submit Your Story
              </Link>
            </div>
          </div>
          
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        </motion.div>
      </div>
    </section>
  )
}
