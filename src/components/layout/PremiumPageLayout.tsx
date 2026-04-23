"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface PremiumPageLayoutProps {
  children: React.ReactNode;
  eyebrow: string;
  titlePlain: string;
  titleAccent: string;
  subtitle: string;
}

export function PremiumPageLayout({
  children,
  eyebrow,
  titlePlain,
  titleAccent,
  subtitle,
}: PremiumPageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden" style={{ background: 'var(--color-surface)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 -left-20 w-96 h-96 rounded-full opacity-[0.06]" style={{ background: 'var(--color-primary)', filter: 'blur(100px)' }} />
          <div className="absolute bottom-0 right-10 w-72 h-72 rounded-full opacity-[0.06]" style={{ background: 'var(--color-tertiary)', filter: 'blur(80px)' }} />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col gap-8">


            <div className="flex flex-col items-center text-center gap-6 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest w-fit"
                style={{ background: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' }}
              >
                <Sparkles className="h-3.5 w-3.5" />
                {eyebrow}
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-center"
                style={{ color: 'var(--color-on-surface)' }}
              >
                {titlePlain}{" "}
                <span className="text-primary italic decoration-yellow-400 underline decoration-4 underline-offset-8">
                  {titleAccent}
                </span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg md:text-xl font-medium max-w-3xl leading-relaxed text-center"
                style={{ color: 'var(--color-on-surface-variant)' }}
              >
                {subtitle}
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="flex-grow pb-24 px-4 sm:px-6 lg:px-8 -mt-2" style={{ background: 'var(--color-surface-container-low)' }}>
        <div className="mx-auto max-w-5xl pt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-6 md:p-12 rounded-[2rem] bg-white border border-outline-variant/30"
            style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}
          >
            {children}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
