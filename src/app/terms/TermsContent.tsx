"use client";

import React from "react";
import { PremiumPageLayout } from "@/components/layout/PremiumPageLayout";
import { Scale, Gavel, Handshake, AlertCircle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export function TermsContent() {
  const rules = [
    { icon: Handshake, title: "Our Commitment", text: "We provide a secure, verified platform for tradespeople and backers. We commit to transparency in fees and disbursements." },
    { icon: CheckCircle, title: "Your Accountability", text: "As a tradesperson, you agree to provide truthful information and use funds only for the stated business needs." },
    { icon: Scale, title: "Vouching Ethics", text: "Vouchers must have first-hand knowledge of a tradesperson's skills. Opaque or fraudulent vouching leads to account suspension." },
    { icon: Gavel, title: "Dispute Resolution", text: "In the rare case of a dispute, we act as a neutral mediator based on proof of use records and community standards." }
  ];

  return (
    <PremiumPageLayout eyebrow="COMMUNITY STANDARDS" titlePlain="Platform" titleAccent="Standards." subtitle="BuildBridge is a community based on mutual trust. These terms ensure the platform remains fair and secure for everyone.">
      <div className="space-y-16">
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: 'var(--color-on-surface-variant)' }}>Last Updated: April 20, 2026</p>
          <p className="text-base font-medium leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
            By accessing or using the BuildBridge platform, you agree to comply with and be bound by 
            these Terms of Service. Please read them carefully.
          </p>
        </motion.section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {rules.map((rule, idx) => (
             <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} whileHover={{ y: -4 }} className="p-8 rounded-[1.5rem] border border-outline-variant/30 transition-shadow hover:shadow-md" style={{ background: 'var(--color-surface-container)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6"><rule.icon size={20} /></div>
                <h3 className="text-lg md:text-xl font-black tracking-tight mb-3" style={{ color: 'var(--color-on-surface)' }}>{rule.title}</h3>
                <p className="text-sm font-medium leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>{rule.text}</p>
             </motion.div>
           ))}
        </div>

        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-[2rem] p-8 sm:p-12 border border-yellow-500/20 bg-yellow-50/50 flex gap-6 items-start">
           <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-600 shrink-0"><AlertCircle size={24} /></div>
           <div>
              <h3 className="text-xl md:text-2xl font-black tracking-tight mb-3" style={{ color: 'var(--color-on-surface)' }}>Important: Keep-what-you-raise</h3>
              <p className="text-base font-medium leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                BuildBridge uses a flexible funding model. Tradespeople may keep what they raise even if the goal 
                is not fully met, provided the amount is sufficient to acquire part of the requested tools or 
                business needs as documented in the listing.
              </p>
           </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4" style={{ background: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' }}>LEGAL</div>
           <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-4" style={{ color: 'var(--color-on-surface)' }}>Governance</h3>
           <p className="text-base font-medium leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
             These terms are governed by the laws of the Federal Republic of Nigeria. 
             We reserve the right to update these terms to reflect changes in the platform or legal requirements. 
             Continued use of the platform constitutes acceptance of updated terms.
           </p>
        </motion.section>

        <div className="pt-4 text-center">
           <p className="text-sm font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>
             Questions about our terms? Reach out to <a href="mailto:legal@buildbridge.africa" className="text-primary font-black hover:underline">legal@buildbridge.africa</a>
           </p>
        </div>
      </div>
    </PremiumPageLayout>
  );
}
