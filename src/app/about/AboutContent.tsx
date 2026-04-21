"use client";

import React from "react";
import { InfoLayout } from "@/components/layout/InfoLayout";
import { Users, Target, ShieldCheck, Heart, Zap, Globe } from "lucide-react";
import { motion } from "framer-motion";

export function AboutContent() {
  const values = [
    {
      icon: Users,
      title: "Community First",
      description: "We believe in the power of community vouching. Trust is built when neighbors stand for neighbors."
    },
    {
      icon: Target,
      title: "Impact, Not Charity",
      description: "Our users are skilled professionals, not charity cases. We fund business growth and tool acquisition."
    },
    {
      icon: ShieldCheck,
      title: "Vetted Trust",
      description: "Every tradesperson on BuildBridge goes through a multi-layer verification process."
    }
  ];

  const features = [
    { icon: Heart, text: "Dignified Support" },
    { icon: Zap, text: "Fast Funding" },
    { icon: Globe, text: "Nigeria-Native" }
  ];

  return (
    <InfoLayout
      heroTitle="Our story is your growth"
      heroSubtitle="BuildBridge is a Nigeria-native micro-crowdfunding platform designed for the informal economy. We bridge the gap between skilled workers and the resources they need to thrive."
    >
      <div className="space-y-16">
        {/* Intro Section */}
        <section className="prose prose-lg max-w-none text-on-surface-variant">
          <h2 className="text-display-small text-on-surface font-bold mb-6">Why BuildBridge?</h2>
          <p className="leading-relaxed">
            In Nigeria, millions of skilled tradespeople—mechanics, tailors, carpenters, and stylists—are 
            the backbone of the economy. Yet, many struggle to grow because they lack access to 
            small, specific amounts of capital for essential tools or equipment.
          </p>
          <p className="leading-relaxed">
            Traditional banks often overlook the informal sector, and charity programs often lack transparency 
            or dignity. **BuildBridge was born to change that.**
          </p>
        </section>

        {/* Impact Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/10"
            >
              <feature.icon className="text-primary" size={24} />
              <span className="font-semibold text-primary">{feature.text}</span>
            </motion.div>
          ))}
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-y border-outline-variant py-12">
          <div>
            <h3 className="text-headline-medium text-on-surface font-bold mb-4">Our Mission</h3>
            <p className="text-on-surface-variant leading-relaxed">
              To empower Nigerian micro-entrepreneurs by bridging the trust gap through community-backed funding and transparent impact storytelling.
            </p>
          </div>
          <div>
            <h3 className="text-headline-medium text-on-surface font-bold mb-4">Our Vision</h3>
            <p className="text-on-surface-variant leading-relaxed">
              A Nigeria where every skilled tradesperson is recognized, verified, and has the financial bridge to reach their full potential.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <section>
          <h2 className="text-display-small text-on-surface font-bold mb-10 text-center">Guided by Trust</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                  <value.icon size={24} />
                </div>
                <h4 className="text-headline-small font-bold text-on-surface">{value.title}</h4>
                <p className="text-on-surface-variant leading-relaxed text-sm">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Team CTA */}
        <section className="bg-primary/5 rounded-3xl p-8 sm:p-12 text-center border border-primary/10">
          <h2 className="text-headline-large font-bold text-on-surface mb-4">Built for Nigeria, by Nigerians</h2>
          <p className="text-on-surface-variant mb-8 max-w-xl mx-auto">
            We are a team of engineers, designers, and community builders passionate about 
            reimagining how trust works in our local markets.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Globe className="text-primary opacity-50" size={32} />
            <span className="text-on-surface-variant font-medium self-center italic">Lagos • Abuja • Port Harcourt • Global Diaspora</span>
          </div>
        </section>
      </div>
    </InfoLayout>
  );
}
