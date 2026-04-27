"use client";

import React from "react";
import { PremiumPageLayout } from "@/components/layout/PremiumPageLayout";
import { 
  ShieldCheck, 
  Lock, 
  UserCheck, 
  MapPin, 
  FileText, 
  AlertTriangle,
  Fingerprint,
  Verified
} from "lucide-react";
import { motion } from "framer-motion";

export function TrustContent() {
  const pillars = [
    {
      icon: Fingerprint,
      title: "Identity Verification",
      description: "We verify every tradesperson using governmental identities (NIN or BVN) to ensure valid identity records."
    },
    {
      icon: UserCheck,
      title: "Community Vouching",
      description: "Every listing requires a vouch from a verified association or peer, adding a layer of social credit."
    },
    {
      icon: MapPin,
      title: "Field Verification",
      description: "For larger needs, our community field officers perform physical visits and geotagged check-ins."
    },
    {
      icon: FileText,
      title: "Proof of Use",
      description: "Funds are released incrementally, and tradespeople must upload receipts and photos of their tools."
    }
  ];

  return (
    <PremiumPageLayout
      eyebrow="SECURITY & VERIFICATION"
      titlePlain="Our foundation is"
      titleAccent="Trust."
      subtitle="BuildBridge is a trust-first platform. We've built an industry-leading verification stack to protect both tradespeople and backers."
    >
      <div className="space-y-20">
        {/* Intro Grid */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6"
              style={{ background: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' }}
            >
              WHY IT MATTERS
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-6" style={{ color: 'var(--color-on-surface)' }}>Safety is not an afterthought.</h2>
            <p className="text-base font-medium leading-relaxed mb-6" style={{ color: 'var(--color-on-surface-variant)' }}>
              In a digital world, trust is hard to build but easy to break. BuildBridge was designed from the ground up to solve the &quot;trust gap&quot; in the Nigerian informal economy.
            </p>
            <div className="space-y-3">
              <div className="flex gap-4 p-4 rounded-2xl border border-outline-variant/30" style={{ background: 'var(--color-surface-container)' }}>
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                  <Lock className="text-green-600" size={18} />
                </div>
                <p className="text-sm font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>Secure escrow payments via licensed payment providers.</p>
              </div>
              <div className="flex gap-4 p-4 rounded-2xl border border-outline-variant/30" style={{ background: 'var(--color-surface-container)' }}>
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Verified className="text-blue-600" size={18} />
                </div>
                <p className="text-sm font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>NDPR-compliant data handling and privacy protection.</p>
              </div>
            </div>
          </div>
          <div className="relative flex justify-center">
             <div className="absolute inset-0 rounded-full opacity-10 pointer-events-none" style={{ background: 'var(--color-primary)', filter: 'blur(60px)' }} />
             <div className="relative z-10 p-10 rounded-[2rem] border border-outline-variant/30 text-center" style={{ background: 'var(--color-surface-container)', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
                <ShieldCheck size={80} className="mx-auto text-primary mb-6" />
                <h3 className="text-xl md:text-2xl font-black tracking-tight" style={{ color: 'var(--color-on-surface)' }}>Verified System</h3>
                <p className="text-sm font-medium mt-2" style={{ color: 'var(--color-on-surface-variant)' }}>Monitoring 24/7 for suspicious activity</p>
             </div>
          </div>
        </motion.section>

        {/* Verification Layers */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4"
              style={{ background: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' }}
            >
              OUR VERIFICATION STACK
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: 'var(--color-on-surface)' }}>The 4 Layers of Proof</h2>
            <p className="text-base font-medium mt-4 max-w-2xl mx-auto" style={{ color: 'var(--color-on-surface-variant)' }}>Before a need goes public, it must pass through our rigorous checks.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {pillars.map((pillar, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="p-8 rounded-[1.5rem] border border-outline-variant/30 transition-shadow hover:shadow-md"
                style={{ background: 'var(--color-surface-container)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                   <pillar.icon size={24} />
                </div>
                <h4 className="text-lg md:text-xl font-black tracking-tight mb-3" style={{ color: 'var(--color-on-surface)' }}>{pillar.title}</h4>
                <p className="text-sm md:text-base font-medium leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Fraud Prevention Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-[2rem] p-8 sm:p-12 border border-error/10 bg-error/5"
        >
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-16 h-16 rounded-2xl bg-error/10 flex items-center justify-center text-error shrink-0">
               <AlertTriangle size={32} />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-black tracking-tight mb-3" style={{ color: 'var(--color-on-surface)' }}>Zero Tolerance for Fraud</h3>
              <p className="text-base font-medium leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                We take safety seriously. Any attempt to use the platform for fraudulent activity results in an immediate permanent ban and, 
                where necessary, reporting to the relevant Nigerian authorities. We protect the integrity of the community at all costs.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Data Security Notice */}
        <div className="text-center pt-4">
           <p className="text-sm font-medium flex items-center justify-center gap-2" style={{ color: 'var(--color-on-surface-variant)' }}>
             <Lock size={14} className="text-primary" /> Your personal information is encrypted and never shared with 3rd parties without consent.
           </p>
        </div>
      </div>
    </PremiumPageLayout>
  );
}
