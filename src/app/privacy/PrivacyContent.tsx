"use client";

import React from "react";
import { InfoLayout } from "@/components/layout/InfoLayout";
import { Shield, Lock } from "lucide-react";
import { motion } from "framer-motion";

export function PrivacyContent() {
  const sections = [
    {
      title: "What we collect",
      content: "We collect basic identity information (NIN, Phone Number, Name) to verify accounts and professional data to facilitate trust-building. We do not sell your personal data."
    },
    {
      title: "How we use your data",
      content: "Your data is used to verify your identity, process pledges, track proof-of-use, and prevent fraud on the platform. Public profiles only show verified trust signals."
    },
    {
      title: "Data Protection (NDPR)",
      content: "Broadbridge is fully compliant with the Nigeria Data Protection Regulation (NDPR). Your information is encrypted and stored securely within protected environments."
    },
    {
      title: "Your Rights",
      content: "You have the right to access, correct, or request the deletion of your data at any time. You can manage your privacy settings from your account dashboard."
    }
  ];

  return (
    <InfoLayout
      heroTitle="Privacy at our Core"
      heroSubtitle="Broadbridge is built on transparency. We protect your data as carefully as we protect our community's trust."
    >
      <div className="space-y-12">
        <section className="prose prose-sm max-w-none text-on-surface-variant italic leading-relaxed">
          <p>Last Updated: April 20, 2026</p>
          <p>
            This Privacy Policy describes how BuildBridge (“we,” “us,” or “our”) collects, uses, and shares 
            your personal information when you use our platform. By using the platform, you agree to the 
            collection and use of information in accordance with this policy.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {sections.map((section, idx) => (
             <motion.div 
               key={idx}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 + idx * 0.1 }}
               className="p-8 rounded-3xl bg-secondary/5 border border-outline-variant italic"
             >
                <h3 className="text-headline-small font-bold text-on-surface mb-4">{section.title}</h3>
                <p className="text-sm leading-relaxed text-on-surface-variant">
                   {section.content}
                </p>
             </motion.div>
           ))}
        </div>

        <section className="bg-primary/5 rounded-3xl p-8 sm:p-12 border border-primary/10">
           <div className="flex gap-4 items-start">
              <Lock className="text-primary shrink-0 mt-1" size={24} />
              <div>
                 <h3 className="text-headline-medium font-bold text-on-surface mb-2 italic">Encryption & Security</h3>
                 <p className="text-sm text-on-surface-variant italic leading-relaxed">
                   We use industry-standard SSL/TLS encryption for all data transfers. Financial information 
                   is handled by PCI-DSS compliant partners and is never stored directly on our servers.
                 </p>
              </div>
           </div>
        </section>

        <div className="pt-8 border-t border-outline-variant text-center">
           <p className="text-xs text-on-surface-variant italic">
             Questions about your privacy? Contact our Data Protection Officer at <a href="mailto:privacy@buildbridge.africa" className="text-primary font-bold underline">privacy@buildbridge.africa</a>
           </p>
        </div>
      </div>
    </InfoLayout>
  );
}
