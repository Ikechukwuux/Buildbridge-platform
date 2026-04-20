"use client";

import React from "react";
import { InfoLayout } from "@/components/layout/InfoLayout";
import { 
  Handshake, 
  Store, 
  BarChart4, 
  Users2, 
  Building2,
  Mail,
  ArrowUpRight
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function PartnersContent() {
  const partnerTypes = [
    {
      icon: Store,
      title: "Market Associations",
      description: "Onboard your members in bulk and provide collective vouching for artisans in your market."
    },
    {
      icon: Users2,
      title: "NGOs & Foundations",
      description: "Direct your empowerment funds to verified individuals with transparent proof-of-use tracking."
    },
    {
      icon: Building2,
      title: "Financial Institutions",
      description: "Reach the unbanked and informal sector using our alternative credit and trust scoring."
    },
    {
      icon: BarChart4,
      title: "Governmental Bodies",
      description: "Execute large-scale social investment programs with digital-first verification and reporting."
    }
  ];

  return (
    <InfoLayout
      heroTitle="Scale Impact Together"
      heroSubtitle="BuildBridge partners with institutions to bring digital trust and financial access to millions of skilled artisans."
    >
      <div className="space-y-16">
        {/* Value Prop Section */}
        <section className="prose prose-lg max-w-none text-on-surface-variant">
          <h2 className="text-display-small text-on-surface font-bold mb-6 italic underline decoration-primary/30 text-center">Institutional Scale, Individual Impact.</h2>
          <p className="leading-relaxed text-center max-w-3xl mx-auto">
            BuildBridge provides the infrastructure for verified, transparent support. We help our partners 
            move away from opaque distribution to a data-driven, traceable impact model.
          </p>
        </section>

        {/* Partner Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {partnerTypes.map((type, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className="p-8 rounded-3xl border border-outline-variant bg-gradient-to-br from-white to-primary/5 hover:to-primary/10 transition-all flex gap-6"
            >
              <div className="w-14 h-14 rounded-2xl bg-white shadow-premium flex items-center justify-center text-primary shrink-0">
                 <type.icon size={28} />
              </div>
              <div>
                <h3 className="text-headline-small font-bold text-on-surface mb-2 italic">{type.title}</h3>
                <p className="text-sm text-on-surface-variant italic leading-relaxed">
                  {type.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Benefits List */}
        <section className="bg-secondary/5 rounded-3xl p-8 sm:p-12 border border-secondary/10">
          <h2 className="text-headline-large font-bold text-on-surface mb-8 italic">Why Collaborate with Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
            {[
              "End-to-end digital verification (NIN/BVN)",
              "Real-time impact dashboard for partners",
              "Reduced administrative overhead",
              "Fraud-resistant disbursement stack",
              "Direct access to verified tradespeople",
              "Custom program design and reporting"
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-3 text-on-surface italic">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="text-center py-12">
           <h2 className="text-display-small font-bold text-on-surface mb-6 italic">Ready to build a bridge with us?</h2>
           <p className="text-on-surface-variant max-w-xl mx-auto mb-10 italic">
             For institutional partnerships, market association onboarding, or CSR inquiries, 
             our partnerships team is ready to chat.
           </p>
           
           <div className="flex flex-col sm:flex-row justify-center gap-6">
             <a href="mailto:partnerships@buildbridge.africa">
                <Button size="lg" className="rounded-full px-8 flex items-center gap-2 shadow-premium">
                   <Mail size={18} /> Email our Team
                </Button>
             </a>
             <Link href="/contact">
                <Button variant="outline" size="lg" className="rounded-full px-8 flex items-center gap-2">
                   Contact Support <ArrowUpRight size={18} />
                </Button>
             </Link>
           </div>
        </section>

        {/* Association Spotlight Placeholder */}
        <div className="border-t border-outline-variant pt-12 text-center opacity-60 grayscale hover:grayscale-0 transition-all">
           <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-6">In partnership with associations across</p>
           <div className="flex flex-wrap justify-center gap-8 text-on-surface-variant font-bold italic">
              <span>Mushin Market</span>
              <span>Alaba International</span>
              <span>Computer Village</span>
              <span>Bodija Market</span>
           </div>
        </div>
      </div>
    </InfoLayout>
  );
}
