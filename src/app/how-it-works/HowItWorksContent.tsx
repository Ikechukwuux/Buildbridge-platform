"use client";

import React from "react";
import { InfoLayout } from "@/components/layout/InfoLayout";
import { 
  ClipboardEdit, 
  Users, 
  Wallet, 
  Camera, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function HowItWorksContent() {
  const steps = [
    {
      number: "01",
      icon: ClipboardEdit,
      title: "Define Your Need",
      description: "Submit a request for specific business tools or equipment. No vague loans—just what you need to work.",
      color: "bg-blue-500/10 text-blue-600"
    },
    {
      number: "02",
      icon: Users,
      title: "Community Vouching",
      description: "Local associations and verified peers vouch for your skill and character. This builds your Trust Score.",
      color: "bg-purple-500/10 text-purple-600"
    },
    {
      number: "03",
      icon: Wallet,
      title: "Get Backed",
      description: "Backers contribute to your need. Funds are held securely in escrow until you are ready to purchase.",
      color: "bg-green-500/10 text-green-600"
    },
    {
      number: "04",
      icon: Camera,
      title: "Share Your Proof",
      description: "Buy your tools, upload proof-of-use, and share your growth story. This completes the trust circle.",
      color: "bg-orange-500/10 text-orange-600"
    }
  ];

  const trustStack = [
    "NIN / BVN Verification",
    "Market Association Vouching",
    "Peer-to-Peer Recommendations",
    "Verified Purchase Receipts",
    "Photo & Video Proof-of-Use"
  ];

  return (
    <InfoLayout
      heroTitle="Simple, transparent, trusted"
      heroSubtitle="BuildBridge isn't just about money—it's about building a reputation that unlocks growth."
    >
      <div className="space-y-20">
        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="relative p-8 rounded-3xl bg-secondary/5 border border-outline-variant hover:border-primary/30 transition-colors group"
            >
              <div className="absolute -top-4 -right-4 text-display-small font-black text-primary/10 select-none">
                {step.number}
              </div>
              <div className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center mb-6 shadow-sm`}>
                <step.icon size={28} />
              </div>
              <h3 className="text-headline-small font-bold text-on-surface mb-3 group-hover:text-primary transition-colors">
                {step.title}
              </h3>
              <p className="text-on-surface-variant leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* The Trust Stack Section */}
        <section className="bg-primary/5 rounded-3xl p-8 sm:p-12 border border-primary/10 overflow-hidden relative">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-display-small text-on-surface font-bold mb-6 italic">The Trust Stack</h2>
              <p className="text-on-surface-variant mb-8 leading-relaxed">
                We use five layers of verification to ensure every need is real and every tradesperson is skilled. 
                This transparency is why backers feel confident on BuildBridge.
              </p>
              <ul className="space-y-4">
                {trustStack.map((item, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex items-center gap-3 text-on-surface font-medium"
                  >
                    <CheckCircle2 className="text-primary shrink-0" size={20} />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
            <div className="flex justify-center">
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 2, 0]
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
                className="w-64 h-80 glass-card rounded-3xl border-primary/20 shadow-premium flex items-center justify-center bg-primary/10"
              >
                <div className="text-primary opacity-40">
                   <ShieldCheck size={120} />
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Decorative background circle */}
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        </section>

        {/* Final CTA Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8 p-8 rounded-3xl border-2 border-dashed border-outline-variant bg-white/50">
          <div className="text-center sm:text-left">
            <h4 className="text-headline-small font-bold text-on-surface">Ready to start?</h4>
            <p className="text-on-surface-variant">Choose your path and build with us today.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/signup">
              <Button variant="outline" className="rounded-full">Get Vouched</Button>
            </Link>
            <Link href="/browse">
              <Button className="rounded-full flex items-center gap-2">
                Back a Need <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </InfoLayout>
  );
}
