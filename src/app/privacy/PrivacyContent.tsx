"use client";

import React from "react";
import { PremiumPageLayout } from "@/components/layout/PremiumPageLayout";
import { Lock } from "lucide-react";
import { motion } from "framer-motion";

export function PrivacyContent() {
  const sections = [
    { title: "What we collect", content: "We collect basic identity information (NIN, Phone Number, Name) to verify accounts and professional data to facilitate trust-building. We do not sell your personal data." },
    { title: "How we use your data", content: "Your data is used to verify your identity, process pledges, track proof of use, and prevent fraud on the platform. Public profiles only show verified trust signals." },
    { title: "Data Protection (NDPR)", content: "BuildBridge is fully compliant with the Nigeria Data Protection Regulation (NDPR). Your information is encrypted and stored securely within protected environments." },
    { title: "Your Rights", content: "You have the right to access, correct, or request the deletion of your data at any time. You can manage your privacy settings from your account dashboard." }
  ];

  return (
    <PremiumPageLayout eyebrow="DATA & COMPLIANCE" titlePlain="Privacy at our" titleAccent="Core." subtitle="BuildBridge is built on transparency. We protect your data as carefully as we protect our community's trust.">
      <div className="space-y-16">
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: 'var(--color-on-surface-variant)' }}>Last Updated: April 20, 2026</p>
          <p className="text-base font-medium leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
            This Privacy Policy describes how BuildBridge (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) collects, uses, and shares 
            your personal information when you use our platform. By using the platform, you agree to the 
            collection and use of information in accordance with this policy.
          </p>
        </motion.section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {sections.map((section, idx) => (
             <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} whileHover={{ y: -4 }} className="p-8 rounded-[1.5rem] border border-outline-variant/30 transition-shadow hover:shadow-md" style={{ background: 'var(--color-surface-container)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                <h3 className="text-lg md:text-xl font-black tracking-tight mb-4" style={{ color: 'var(--color-on-surface)' }}>{section.title}</h3>
                <p className="text-sm font-medium leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>{section.content}</p>
             </motion.div>
           ))}
        </div>

        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-[2rem] p-8 sm:p-12 border border-primary/10" style={{ background: 'var(--color-primary-container)' }}>
           <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0"><Lock size={24} /></div>
              <div>
                 <h3 className="text-xl md:text-2xl font-black tracking-tight mb-3" style={{ color: 'var(--color-on-primary-container)' }}>Encryption &amp; Security</h3>
                 <p className="text-sm md:text-base font-medium leading-relaxed" style={{ color: 'var(--color-on-primary-container)', opacity: 0.7 }}>
                   We use industry-standard SSL/TLS encryption for all data transfers. Financial information 
                   is handled by PCI-DSS compliant partners and is never stored directly on our servers.
                 </p>
              </div>
           </div>
        </motion.section>

        <div className="pt-4 text-center">
           <p className="text-sm font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>
             Questions about your privacy? Contact our Data Protection Officer at <a href="mailto:privacy@buildbridge.africa" className="text-primary font-black hover:underline">privacy@buildbridge.africa</a>
           </p>
        </div>
      </div>
    </PremiumPageLayout>
  );
}
