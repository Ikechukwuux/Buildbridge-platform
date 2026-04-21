"use client";

import React from "react";
import { InfoLayout } from "@/components/layout/InfoLayout";
import { FileText, Scale, Gavel, Handshake, AlertCircle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export function TermsContent() {
  const rules = [
    {
      icon: Handshake,
      title: "Our Commitment",
      text: "We provide a secure, verified platform for tradespeople and backers. We commit to transparency in fees and disbursements."
    },
    {
      icon: CheckCircle,
      title: "Your Accountability",
      text: "As a tradesperson, you agree to provide truthful information and use funds only for the stated business needs."
    },
    {
      icon: Scale,
      title: "Vouching Ethics",
      text: "Vouchers must have first-hand knowledge of a tradesperson's skills. Opaque or fraudulent vouching leads to account suspension."
    },
    {
      icon: Gavel,
      title: "Dispute Resolution",
      text: "In the rare case of a dispute, we act as a neutral mediator based on proof-of-use records and community standards."
    }
  ];

  return (
    <InfoLayout
      heroTitle="Platform Standards"
      heroSubtitle="BuildBridge is a community based on mutual trust. These terms ensure the platform remains fair and secure for everyone."
    >
      <div className="space-y-16">
        <section className="prose prose-sm max-w-none text-on-surface-variant italic leading-relaxed">
          <p>Last Updated: April 20, 2026</p>
          <p>
            By accessing or using the BuildBridge platform, you agree to comply with and be bound by 
            these Terms of Service. Please read them carefully.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {rules.map((rule, idx) => (
             <motion.div 
               key={idx}
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: idx * 0.1 }}
               className="p-8 rounded-3xl bg-white border border-outline-variant shadow-premium italic"
             >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                   <rule.icon size={20} />
                </div>
                <h3 className="text-headline-small font-bold text-on-surface mb-3">{rule.title}</h3>
                <p className="text-sm leading-relaxed text-on-surface-variant">
                   {rule.text}
                </p>
             </motion.div>
           ))}
        </div>

        <section className="bg-warning/5 rounded-3xl p-8 sm:p-12 border border-warning/20 flex gap-6 items-start">
           <AlertCircle className="text-warning shrink-0 mt-1" size={24} />
           <div>
              <h3 className="text-headline-medium font-bold text-on-surface mb-2 italic">Important: Keep-what-you-raise</h3>
              <p className="text-sm text-on-surface-variant italic leading-relaxed">
                BuildBridge uses a flexible funding model. Tradespeople may keep what they raise even if the goal 
                is not fully met, provided the amount is sufficient to acquire part of the requested tools or 
                business needs as documented in the listing.
              </p>
           </div>
        </section>

        <section className="space-y-6">
           <h3 className="text-headline-large font-bold text-on-surface italic">Governance</h3>
           <p className="text-sm text-on-surface-variant italic leading-relaxed">
             These terms are governed by the laws of the Federal Republic of Nigeria. 
             We reserve the right to update these terms to reflect changes in the platform or legal requirements. 
             Continued use of the platform constitutes acceptance of updated terms.
           </p>
        </section>

        <div className="pt-8 border-t border-outline-variant text-center">
           <p className="text-xs text-on-surface-variant italic">
             Questions about our terms? Reach out to <a href="mailto:legal@buildbridge.africa" className="text-primary font-bold underline">legal@buildbridge.africa</a>
           </p>
        </div>
      </div>
    </InfoLayout>
  );
}
