"use client";

import React, { useState } from "react";
import { 
  ClipboardEdit, 
  Users, 
  Wallet, 
  Camera, 
  ShieldCheck,
  FileBadge,
  UserCheck,
  Receipt,
  Image as ImageIcon,
  ArrowRight,
  Sparkles,
  ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function HowItWorksContent() {
  const [activeTrustIndex, setActiveTrustIndex] = useState(0);

  const lifecycleSteps = [
    {
      number: "01",
      icon: ClipboardEdit,
      title: "Define Your Need",
      description: "Submit a request for specific business tools or equipment. No vague loans—just what you need to work.",
      example: "Amina, a tailor, requests an Industrial Overlock Machine for ₦350,000 to fulfill school uniform contracts.",
      color: "text-blue-600",
      bgColor: "bg-blue-500/10"
    },
    {
      number: "02",
      icon: Users,
      title: "Community Vouching",
      description: "Local associations and verified peers vouch for your skill and character. This builds your Trust Score.",
      example: "The Surulere Tailors Association and 8 local peers vouch for Amina's reliability and craftsmanship.",
      color: "text-purple-600",
      bgColor: "bg-purple-500/10"
    },
    {
      number: "03",
      icon: Wallet,
      title: "Get Backed",
      description: "Backers contribute to your need. Funds are held securely in escrow until you are ready to purchase.",
      example: "14 backers from around the world contribute to Amina's need until the ₦350,000 goal is met.",
      color: "text-green-600",
      bgColor: "bg-green-500/10"
    },
    {
      number: "04",
      icon: Camera,
      title: "Share Your Proof",
      description: "Buy your tools, upload proof of use, and share your growth story. This completes the trust circle.",
      example: "Amina purchases the machine, uploads a photo of her using it, and unlocks a Level 2 badge for future needs.",
      color: "text-orange-600",
      bgColor: "bg-orange-500/10"
    }
  ];

  const trustStack = [
    {
      title: "NIN / BVN Verification",
      icon: FileBadge,
      description: "Every tradesperson undergoes strict identity verification via national databases to ensure they are who they say they are."
    },
    {
      title: "Market Association Vouching",
      icon: Users,
      description: "We partner with local market associations and guilds who act as offline guarantors for their members."
    },
    {
      title: "Peer Recommendations",
      icon: UserCheck,
      description: "Established tradespeople on the platform can vouch for newcomers, putting their own reputation on the line."
    },
    {
      title: "Verified Purchases",
      icon: Receipt,
      description: "Funds are either sent directly to vetted equipment vendors or require strict receipt validation."
    },
    {
      title: "Proof of Use",
      icon: ImageIcon,
      description: "Tradespeople upload photos and videos of the funded equipment in action, closing the transparency loop."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden">
      {/* Hero Section — matches Browse Needs hero pattern */}
      <section className="relative pt-32 pb-16 overflow-hidden" style={{ background: 'var(--color-surface)' }}>
        {/* Decorative mesh background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 -left-20 w-96 h-96 rounded-full opacity-[0.06]" style={{ background: 'var(--color-primary)', filter: 'blur(100px)' }} />
          <div className="absolute bottom-0 right-10 w-72 h-72 rounded-full opacity-[0.06]" style={{ background: 'var(--color-tertiary)', filter: 'blur(80px)' }} />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col gap-8">
            {/* Back button */}


            <div className="flex flex-col items-center text-center gap-6 max-w-4xl mx-auto">
              {/* Eyebrow badge — same pattern as Browse Needs */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest w-fit"
                style={{ background: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' }}
              >
                <Sparkles className="h-3.5 w-3.5" />
                4 SIMPLE STEPS TO GET FUNDED
              </motion.div>

              {/* Title — same scale/weight as Browse Needs */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight"
                style={{ color: 'var(--color-on-surface)' }}
              >
                How it{" "}
                <span className="text-primary italic decoration-yellow-400 underline decoration-4 underline-offset-8">
                  Works.
                </span>
              </motion.h1>

              {/* Subtitle — same pattern as Browse Needs */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg md:text-xl font-medium max-w-3xl leading-relaxed"
                style={{ color: 'var(--color-on-surface-variant)' }}
              >
                BuildBridge isn&apos;t just about money—it&apos;s about building a reputation that unlocks growth. Every pledge is held in escrow and only deployed once goals are reached.
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
            className="flex flex-col gap-6 p-6 md:p-12 rounded-[2rem] bg-white border border-outline-variant/30"
            style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}
          >
            <div className="space-y-24">
            
              {/* Storytelling Lifecycle Timeline */}
              <div className="space-y-16 relative">
                {/* Vertical connecting line */}
                <div className="absolute left-[2.25rem] md:left-1/2 top-8 bottom-8 w-px bg-outline-variant/50 hidden sm:block -z-10" />

                {lifecycleSteps.map((step, index) => {
                  const isEven = index % 2 === 0;
                  return (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      className={`flex flex-col md:flex-row gap-8 md:gap-16 items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                    >
                      {/* Content Side */}
                      <div className="flex-1 w-full">
                        <div className="flex items-center gap-4 mb-4 md:hidden">
                          <div className={`w-12 h-12 rounded-2xl ${step.bgColor} ${step.color} flex items-center justify-center shrink-0`}>
                            <step.icon size={24} />
                          </div>
                          <span className="text-3xl font-black text-primary/20">{step.number}</span>
                        </div>
                        
                        <div className="flex flex-col items-start text-left">
                          <h3 className="text-xl md:text-2xl font-black text-on-surface mb-3 tracking-tight">
                            {step.title}
                          </h3>
                          <p className="text-on-surface-variant leading-relaxed text-base md:text-lg font-medium mb-0 max-w-md">
                            {step.description}
                          </p>
                        </div>
                      </div>

                      {/* Center Node */}
                      <div className="hidden md:flex flex-col items-center justify-center relative z-10 shrink-0">
                        <div className={`w-16 h-16 rounded-[2rem] ${step.bgColor} ${step.color} flex items-center justify-center shadow-xl border border-white/20 backdrop-blur-sm relative`}>
                           {/* Glow effect */}
                           <div className="absolute inset-0 rounded-full blur-2xl opacity-20" style={{ background: 'currentColor' }} />
                           <step.icon size={28} className="relative z-10" />
                        </div>
                      </div>

                      {/* Example Side */}
                      <div className="flex-1 w-full mt-4 md:mt-0">
                        <div className="p-8 rounded-[2.5rem] border border-outline-variant/30 relative overflow-hidden transition-all hover:shadow-lg group" style={{ background: 'var(--color-surface-container)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                          <div className="absolute -bottom-6 -right-6 p-6 opacity-[0.03] group-hover:opacity-[0.07] group-hover:scale-110 transition-all duration-500 pointer-events-none">
                             <step.icon size={120} />
                          </div>
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-primary mb-4 bg-primary/10">
                            <Sparkles size={12} /> Real Example
                          </div>
                          <p className="text-on-surface leading-relaxed text-sm md:text-base font-bold italic relative z-10">
                            &quot;{step.example}&quot;
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Interactive Trust Stack */}
              <section className="rounded-[2rem] p-8 sm:p-12 border border-primary/10 overflow-hidden relative" style={{ background: 'var(--color-primary-container)', opacity: 0.95 }}>
                <div className="absolute inset-0 opacity-30 pointer-events-none">
                  <div className="absolute top-20 -left-20 w-96 h-96 rounded-full" style={{ background: 'var(--color-primary)', filter: 'blur(120px)', opacity: 0.1 }} />
                </div>
                
                <div className="text-center max-w-2xl mx-auto mb-12 relative z-10">
                  <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4" style={{ color: 'var(--color-on-primary-container)' }}>The Trust Stack</h2>
                  <p className="text-base md:text-lg font-medium leading-relaxed" style={{ color: 'var(--color-on-primary-container)', opacity: 0.7 }}>
                    We use five layers of verification to ensure every need is real. Select a layer to understand how we protect backers.
                  </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 items-center relative z-10">
                  {/* Interactive List */}
                  <div className="w-full lg:w-1/2 space-y-3">
                    {trustStack.map((item, index) => {
                      const isActive = activeTrustIndex === index;
                      return (
                        <button
                          key={index}
                          onClick={() => setActiveTrustIndex(index)}
                          className={`w-full text-left p-5 rounded-2xl transition-all duration-300 flex items-center gap-4 border ${
                            isActive 
                              ? "bg-white shadow-lg border-primary/20 scale-[1.02]" 
                              : "hover:bg-white/50 border-transparent"
                          }`}
                          style={{ boxShadow: isActive ? '0 8px 30px rgba(0,0,0,0.06)' : 'none' }}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                            isActive ? "bg-primary/10 text-primary" : "bg-outline-variant/20 text-on-surface-variant"
                          }`}>
                            <item.icon size={20} />
                          </div>
                          <span className={`font-bold text-base md:text-lg ${isActive ? "text-on-surface" : "text-on-surface-variant"}`}>
                            {item.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Dynamic Display Area */}
                  <div className="w-full lg:w-1/2 flex justify-center">
                    <div className="w-full max-w-sm aspect-square bg-white rounded-[2rem] p-8 flex flex-col items-center justify-center text-center relative overflow-hidden border border-outline-variant/30" style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeTrustIndex}
                          initial={{ opacity: 0, scale: 0.9, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className="flex flex-col items-center"
                        >
                          {(() => {
                            const ActiveIcon = trustStack[activeTrustIndex].icon;
                            return (
                              <div className="w-24 h-24 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                                <ActiveIcon size={48} strokeWidth={1.5} />
                              </div>
                            );
                          })()}
                          <h4 className="text-xl md:text-2xl font-black text-on-surface mb-4 tracking-tight">
                            {trustStack[activeTrustIndex].title}
                          </h4>
                          <p className="text-on-surface-variant text-base md:text-lg leading-relaxed font-medium">
                            {trustStack[activeTrustIndex].description}
                          </p>
                        </motion.div>
                      </AnimatePresence>
                      
                      {/* Background decorative ring */}
                      <div className="absolute inset-0 border-[40px] border-primary/5 rounded-[2rem] pointer-events-none scale-150" />
                    </div>
                  </div>
                </div>
              </section>

              {/* Final CTA Strip */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 sm:p-12 rounded-[2rem] border border-outline-variant/30 relative overflow-hidden"
                style={{ background: 'var(--color-surface-container)', boxShadow: '0 8px 30px rgba(0,0,0,0.03)' }}
              >
                <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full pointer-events-none" style={{ background: 'var(--color-primary)', filter: 'blur(80px)', opacity: 0.05 }} />
                <div className="absolute -left-24 -bottom-24 w-72 h-72 rounded-full pointer-events-none" style={{ background: 'var(--color-tertiary)', filter: 'blur(80px)', opacity: 0.05 }} />
                
                <div className="text-center md:text-left relative z-10 max-w-xl">
                  <h4 className="text-2xl md:text-3xl font-black tracking-tight mb-3" style={{ color: 'var(--color-on-surface)' }}>Ready to start?</h4>
                  <p className="text-base md:text-lg font-medium leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>Choose your path and build with us today. Whether you&apos;re seeking funding or looking to back a tradesperson.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 relative z-10 shrink-0">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                    <Link href="/signup" className="block w-full">
                      <Button variant="outline" size="lg" className="rounded-full w-full sm:w-auto text-base px-8 font-black border-2 hover:bg-primary/5 transition-colors whitespace-nowrap">
                        Get Vouched
                      </Button>
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                    <Link href="/browse" className="block w-full">
                      <Button size="lg" className="rounded-full flex items-center justify-center gap-2 w-full sm:w-auto text-base px-8 font-black shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap">
                        Back a Need <ArrowRight size={18} className="ml-1" />
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </motion.div>

            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
