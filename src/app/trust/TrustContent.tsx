"use client";

import React from "react";
import { InfoLayout } from "@/components/layout/InfoLayout";
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
      title: "Proof-of-Use",
      description: "Funds are released incrementally, and tradespeople must upload receipts and photos of their tools."
    }
  ];

  return (
    <InfoLayout
      heroTitle="Our foundation is Trust"
      heroSubtitle="Broadbridge is a trust-first platform. We've built an industry-leading verification stack to protect both tradespeople and backers."
    >
      <div className="space-y-16">
        {/* Intro Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-display-small text-on-surface font-bold mb-6 italic underline decoration-primary/30">Safety is not an afterthought.</h2>
            <p className="text-on-surface-variant leading-relaxed mb-6">
              In a digital world, trust is hard to build but easy to break. BuildBridge was designed from the ground up to solve the "trust gap" in the Nigerian informal economy.
            </p>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 rounded-xl bg-green-50 border border-green-100 italic">
                <Lock className="text-green-600 shrink-0" size={20} />
                <p className="text-sm text-green-800">Secure escrow payments via licensed payment providers.</p>
              </div>
              <div className="flex gap-4 p-4 rounded-xl bg-blue-50 border border-blue-100 italic">
                <Verified className="text-blue-600 shrink-0" size={20} />
                <p className="text-sm text-blue-800">NDPR-compliant data handling and privacy protection.</p>
              </div>
            </div>
          </div>
          <div className="relative">
             <div className="aspect-square rounded-full bg-primary/5 absolute inset-0 animate-pulse" />
             <div className="relative z-10 glass-card p-10 rounded-[3rem] border-primary/20 shadow-premium text-center">
                <ShieldCheck size={80} className="mx-auto text-primary mb-6" />
                <h3 className="text-headline-medium font-bold text-on-surface">Verified System</h3>
                <p className="text-sm text-on-surface-variant mt-2 italic">Monitoring 24/7 for suspicious activity</p>
             </div>
          </div>
        </section>

        {/* Verification Layers */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-display-small text-on-surface font-bold mb-4">The 4 Layers of Proof</h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto italic">Before a need goes public, it must pass through our rigorous checks.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {pillars.map((pillar, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="p-8 rounded-3xl glass-card border-outline-variant hover:border-primary/40 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                   <pillar.icon size={24} />
                </div>
                <h4 className="text-headline-small font-bold text-on-surface mb-3">{pillar.title}</h4>
                <p className="text-on-surface-variant text-sm leading-relaxed italic">
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Fraud Prevention Section */}
        <section className="bg-error/5 rounded-3xl p-8 sm:p-12 border border-error/10">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-16 h-16 rounded-full bg-error/20 flex items-center justify-center text-error shrink-0">
               <AlertTriangle size={32} />
            </div>
            <div>
              <h3 className="text-headline-medium font-bold text-on-surface mb-2 italic">Zero Tolerance for Fraud</h3>
              <p className="text-on-surface-variant italic leading-relaxed">
                We take safety seriously. Any attempt to use the platform for fraudulent activity results in an immediate permanent ban and, 
                where necessary, reporting to the relevant Nigerian authorities. We protect the integrity of the community at all costs.
              </p>
            </div>
          </div>
        </section>

        {/* Data Security Notice */}
        <div className="text-center py-8">
           <p className="text-sm text-on-surface-variant flex items-center justify-center gap-2 italic">
             <Lock size={14} /> Your personal information is encrypted and never shared with 3rd parties without consent.
           </p>
        </div>
      </div>
    </InfoLayout>
  );
}
