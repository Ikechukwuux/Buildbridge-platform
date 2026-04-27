"use client";

import React from "react";
import { PremiumPageLayout } from "@/components/layout/PremiumPageLayout";
import { Store, BarChart4, Users2, Building2, Mail, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function PartnersContent() {
  const partnerTypes = [
    { icon: Store, title: "Market Associations", description: "Onboard your members in bulk and provide collective vouching for artisans in your market." },
    { icon: Users2, title: "NGOs & Foundations", description: "Direct your empowerment funds to verified individuals with transparent usage tracking." },
    { icon: Building2, title: "Financial Institutions", description: "Reach the unbanked and informal sector using our alternative credit and trust scoring." },
    { icon: BarChart4, title: "Governmental Bodies", description: "Execute large-scale social investment programs with digital-first verification and reporting." }
  ];

  const benefits = ["End-to-end digital verification (NIN/BVN)", "Real-time impact dashboard for partners", "Reduced administrative overhead", "Fraud-resistant disbursement stack", "Direct access to verified tradespeople", "Custom program design and reporting"];

  return (
    <PremiumPageLayout eyebrow="INSTITUTIONAL PARTNERSHIPS" titlePlain="Scale Impact" titleAccent="Together." subtitle="BuildBridge partners with institutions to bring digital trust and financial access to millions of skilled artisans.">
      <div className="space-y-20">
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4" style={{ background: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' }}>THE MODEL</div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4" style={{ color: 'var(--color-on-surface)' }}>Institutional Scale, Individual Impact.</h2>
          <p className="text-base md:text-lg font-medium leading-relaxed max-w-3xl mx-auto" style={{ color: 'var(--color-on-surface-variant)' }}>BuildBridge provides the infrastructure for verified, transparent support. We help our partners move away from opaque distribution to a data-driven, traceable impact model.</p>
        </motion.section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {partnerTypes.map((type, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ y: -4 }} className="p-8 rounded-[1.5rem] border border-outline-variant/30 flex gap-6 transition-shadow hover:shadow-md" style={{ background: 'var(--color-surface-container)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0"><type.icon size={28} /></div>
              <div>
                <h3 className="text-lg md:text-xl font-black tracking-tight mb-2" style={{ color: 'var(--color-on-surface)' }}>{type.title}</h3>
                <p className="text-sm font-medium leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>{type.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-[2rem] p-8 sm:p-12 border border-primary/10" style={{ background: 'var(--color-primary-container)' }}>
          <h2 className="text-xl md:text-2xl font-black tracking-tight mb-8" style={{ color: 'var(--color-on-primary-container)' }}>Why Collaborate with Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
            {benefits.map((benefit, i) => (<div key={i} className="flex items-center gap-3"><CheckCircle2 size={16} className="text-primary shrink-0" /><span className="text-sm md:text-base font-medium" style={{ color: 'var(--color-on-primary-container)' }}>{benefit}</span></div>))}
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-[2rem] p-8 sm:p-12 text-center border border-outline-variant/30 relative overflow-hidden" style={{ background: 'var(--color-surface-container)', boxShadow: '0 8px 30px rgba(0,0,0,0.03)' }}>
          <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full pointer-events-none" style={{ background: 'var(--color-primary)', filter: 'blur(80px)', opacity: 0.05 }} />
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-4" style={{ color: 'var(--color-on-surface)' }}>Ready to build a bridge with us?</h2>
            <p className="text-base font-medium leading-relaxed max-w-xl mx-auto mb-10" style={{ color: 'var(--color-on-surface-variant)' }}>For institutional partnerships, market association onboarding, or CSR inquiries, our partnerships team is ready to chat.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}><a href="mailto:partnerships@buildbridge.africa"><Button size="lg" className="rounded-full px-8 flex items-center gap-2 font-black shadow-lg shadow-primary/20 whitespace-nowrap"><Mail size={18} /> Email our Team</Button></a></motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}><Link href="/about"><Button variant="outline" size="lg" className="rounded-full px-8 flex items-center gap-2 font-black border-2 whitespace-nowrap">Learn About Us <ArrowUpRight size={18} /></Button></Link></motion.div>
            </div>
          </div>
        </motion.section>

        <div className="pt-6 text-center">
           <p className="text-[10px] font-black uppercase tracking-widest mb-6" style={{ color: 'var(--color-on-surface-variant)' }}>In partnership with associations across</p>
           <div className="flex flex-wrap justify-center gap-6 text-sm font-black" style={{ color: 'var(--color-on-surface-variant)', opacity: 0.6 }}>
              <span>Mushin Market</span><span>•</span><span>Alaba International</span><span>•</span><span>Computer Village</span><span>•</span><span>Bodija Market</span>
           </div>
        </div>
      </div>
    </PremiumPageLayout>
  );
}
