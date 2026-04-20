"use client";

import React from "react";
import { InfoLayout } from "@/components/layout/InfoLayout";
import { 
  Briefcase, 
  Sparkles, 
  Coffee, 
  Map, 
  Zap,
  ArrowRight,
  TrendingUp,
  Heart
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

export function CareersContent() {
  const roles = [
    {
      title: "Senior Product Engineer",
      team: "Engineering",
      location: "Remote / Lagos",
      type: "Full-time"
    },
    {
      title: "Partnerships Manager",
      team: "Growth",
      location: "Lagos / Field",
      type: "Full-time"
    },
    {
      title: "Community Field Officer",
      team: "Operations",
      location: "Kano / Abuja / PH",
      type: "Contract"
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "User Dignity",
      description: "We build for artisans with the respect they deserve."
    },
    {
      icon: Zap,
      title: "Extreme Speed",
      description: "We move fast to bridge financial gaps when they matter."
    },
    {
      icon: TrendingUp,
      title: "Local Excellence",
      description: "We solve Nigerian problems with world-class engineering."
    }
  ];

  return (
    <InfoLayout
      heroTitle="Build for the Next Billion"
      heroSubtitle="We are reimagining trust and financial access for the informal economy. Join us on our mission to unlock growth for millions."
    >
      <div className="space-y-20">
        {/* Intro Section */}
        <section className="text-center space-y-6">
           <h2 className="text-display-small text-on-surface font-bold italic underline decoration-primary/30">Why BuildBridge?</h2>
           <p className="text-on-surface-variant leading-relaxed max-w-2xl mx-auto italic">
             Working at BuildBridge means solving real-world trust gaps using state-of-the-art technology. 
             We are an impact-first company building tools for those who build our world.
           </p>
        </section>

        {/* Culture / Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {values.map((v, i) => (
             <div key={i} className="p-8 rounded-3xl bg-primary/5 border border-primary/10 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-premium flex items-center justify-center text-primary mb-6">
                   <v.icon size={24} />
                </div>
                <h4 className="text-headline-small font-bold text-on-surface mb-2 italic">{v.title}</h4>
                <p className="text-sm text-on-surface-variant italic leading-relaxed">{v.description}</p>
             </div>
           ))}
        </div>

        {/* Roles Section */}
        <section>
           <div className="flex items-center gap-3 mb-10">
              <Sparkles className="text-primary" size={28} />
              <h3 className="text-headline-large font-bold text-on-surface italic">Open Roles</h3>
           </div>

           <div className="space-y-4">
              {roles.map((role, index) => (
                 <motion.div
                   key={index}
                   whileHover={{ x: 10 }}
                   className="p-6 rounded-2xl border border-outline-variant bg-white/50 hover:bg-primary/5 hover:border-primary/30 transition-all flex flex-col sm:flex-row items-center justify-between gap-6 group"
                 >
                    <div className="text-center sm:text-left">
                       <h4 className="text-headline-small font-bold text-on-surface group-hover:text-primary transition-colors italic">{role.title}</h4>
                       <div className="flex gap-4 mt-2 text-xs font-bold text-on-surface-variant uppercase tracking-widest italic">
                          <span className="flex items-center gap-1"><Coffee size={12} /> {role.team}</span>
                          <span className="flex items-center gap-1"><Map size={12} /> {role.location}</span>
                          <span className="text-primary/70">{role.type}</span>
                       </div>
                    </div>
                    <Button variant="ghost" className="rounded-full group-hover:bg-primary group-hover:text-white transition-all">
                       Apply Now <ArrowRight size={16} className="ml-2" />
                    </Button>
                 </motion.div>
              ))}
           </div>
           
           <p className="mt-8 text-center text-on-surface-variant italic text-sm">
             Don't see a role that fits? <a href="mailto:careers@buildbridge.africa" className="text-primary font-bold underline">Send us a general application</a>.
           </p>
        </section>

        {/* Perks Grid */}
        <section className="bg-secondary/5 rounded-3xl p-10 border border-secondary/10">
           <h3 className="text-headline-medium font-bold text-on-surface mb-8 italic">Life at BuildBridge</h3>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                "Remote-First",
                "Equity Options",
                "Health Cover",
                "Paid Sabbaticals",
                "Learning Budget",
                "Co-working Access",
                "Team Retreats",
                "Flexible Hours"
              ].map((perk, i) => (
                <div key={i} className="p-4 rounded-xl border border-outline-variant bg-white/50 text-xs font-bold text-on-surface italic">
                   {perk}
                </div>
              ))}
           </div>
        </section>
      </div>
    </InfoLayout>
  );
}
