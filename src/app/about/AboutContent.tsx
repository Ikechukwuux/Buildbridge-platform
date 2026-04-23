"use client";

import React from "react";
import { Users, Target, ShieldCheck, Heart, Zap, Globe, Sparkles, ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

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
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden">
      {/* Hero Section — matches Browse Needs / How It Works hero pattern */}
      <section className="relative pt-32 pb-16 overflow-hidden" style={{ background: 'var(--color-surface)' }}>
        {/* Decorative mesh background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 -left-20 w-96 h-96 rounded-full opacity-[0.06]" style={{ background: 'var(--color-primary)', filter: 'blur(100px)' }} />
          <div className="absolute bottom-0 right-10 w-72 h-72 rounded-full opacity-[0.06]" style={{ background: 'var(--color-tertiary)', filter: 'blur(80px)' }} />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col gap-8">
            {/* Back button */}


            <div className="flex flex-col items-center text-center gap-6 max-w-4xl mx-auto">
              {/* Eyebrow badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest w-fit"
                style={{ background: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' }}
              >
                <Sparkles className="h-3.5 w-3.5" />
                OUR STORY AND MISSION
              </motion.div>

              {/* Title */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight"
                style={{ color: 'var(--color-on-surface)' }}
              >
                Our story is your{" "}
                <span className="text-primary italic decoration-yellow-400 underline decoration-4 underline-offset-8">
                  growth.
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg md:text-xl font-medium max-w-3xl leading-relaxed"
                style={{ color: 'var(--color-on-surface-variant)' }}
              >
                BuildBridge is a Nigeria-native micro-crowdfunding platform designed for the informal economy. We bridge the gap between skilled workers and the resources they need to thrive.
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="flex-grow pb-24 px-4 sm:px-6 lg:px-8 -mt-2" style={{ background: 'var(--color-surface-container-low)' }}>
        <div className="mx-auto max-w-5xl pt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col gap-6 p-6 md:p-12 rounded-[2rem] bg-white border border-outline-variant/30"
            style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}
          >
            <div className="space-y-20">

              {/* Intro Section — Why BuildBridge? */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6"
                  style={{ background: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' }}
                >
                  THE PROBLEM WE SOLVE
                </div>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-6" style={{ color: 'var(--color-on-surface)' }}>Why BuildBridge?</h2>
                <div className="space-y-4 max-w-3xl">
                  <p className="text-base md:text-lg font-medium leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                    In Nigeria, millions of skilled tradespeople—mechanics, tailors, carpenters, and stylists—are 
                    the backbone of the economy. Yet, many struggle to grow because they lack access to 
                    small, specific amounts of capital for essential tools or equipment.
                  </p>
                  <p className="text-base md:text-lg font-medium leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                    Traditional banks often overlook the informal sector, and charity programs often lack transparency 
                    or dignity. <strong className="font-black" style={{ color: 'var(--color-on-surface)' }}>BuildBridge was born to change that.</strong>
                  </p>
                </div>
              </motion.section>

              {/* Impact Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ scale: 1.03, y: -2 }}
                    className="flex items-center gap-4 p-5 rounded-2xl border border-outline-variant/30 cursor-default transition-shadow hover:shadow-md"
                    style={{ background: 'var(--color-surface-container)' }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <feature.icon className="text-primary" size={20} />
                    </div>
                    <span className="font-black text-sm uppercase tracking-widest" style={{ color: 'var(--color-on-surface)' }}>{feature.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* Mission & Vision */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    label: "OUR MISSION",
                    title: "Our Mission",
                    text: "To empower Nigerian micro-entrepreneurs by bridging the trust gap through community-backed funding and transparent impact storytelling."
                  },
                  {
                    label: "OUR VISION",
                    title: "Our Vision",
                    text: "A Nigeria where every skilled tradesperson is recognized, verified, and has the financial bridge to reach their full potential."
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    className="p-8 rounded-[1.5rem] border border-outline-variant/30 relative overflow-hidden"
                    style={{ background: 'var(--color-surface-container)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}
                  >
                    <div className="absolute -right-12 -top-12 w-32 h-32 rounded-full pointer-events-none" style={{ background: 'var(--color-primary)', filter: 'blur(60px)', opacity: 0.05 }} />
                    <div className="relative z-10">
                      <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">{item.label}</div>
                      <h3 className="text-xl md:text-2xl font-black tracking-tight mb-4" style={{ color: 'var(--color-on-surface)' }}>{item.title}</h3>
                      <p className="text-base font-medium leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                        {item.text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Core Values — Guided by Trust */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4"
                    style={{ background: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' }}
                  >
                    WHAT DRIVES US
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: 'var(--color-on-surface)' }}>Guided by Trust</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {values.map((value, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ y: -4 }}
                      className="p-8 rounded-[1.5rem] border border-outline-variant/30 transition-shadow hover:shadow-md"
                      style={{ background: 'var(--color-surface-container)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                        <value.icon size={24} />
                      </div>
                      <h4 className="text-lg md:text-xl font-black tracking-tight mb-3" style={{ color: 'var(--color-on-surface)' }}>{value.title}</h4>
                      <p className="text-sm md:text-base font-medium leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                        {value.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* Team CTA — Built for Nigeria, by Nigerians */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="rounded-[2rem] p-8 sm:p-12 border border-primary/10 text-center relative overflow-hidden"
                style={{ background: 'var(--color-primary-container)' }}
              >
                <div className="absolute inset-0 opacity-30 pointer-events-none">
                  <div className="absolute top-10 -right-20 w-80 h-80 rounded-full" style={{ background: 'var(--color-primary)', filter: 'blur(100px)', opacity: 0.1 }} />
                </div>
                <div className="relative z-10">
                  <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-4" style={{ color: 'var(--color-on-primary-container)' }}>Built for Nigeria, by Nigerians</h2>
                  <p className="text-base md:text-lg font-medium leading-relaxed max-w-xl mx-auto mb-8" style={{ color: 'var(--color-on-primary-container)', opacity: 0.7 }}>
                    We are a team of engineers, designers, and community builders passionate about 
                    reimagining how trust works in our local markets.
                  </p>
                  <div className="flex flex-wrap justify-center items-center gap-3">
                    <Globe className="text-primary opacity-60" size={24} />
                    <span className="text-sm font-black uppercase tracking-widest" style={{ color: 'var(--color-on-primary-container)', opacity: 0.6 }}>Lagos • Abuja • Port Harcourt • Global Diaspora</span>
                  </div>
                </div>
              </motion.section>

              {/* Final CTA Strip — matches How It Works */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 sm:p-12 rounded-[2rem] border border-outline-variant/30 relative overflow-hidden"
                style={{ background: 'var(--color-surface-container)', boxShadow: '0 8px 30px rgba(0,0,0,0.03)' }}
              >
                <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full pointer-events-none" style={{ background: 'var(--color-primary)', filter: 'blur(80px)', opacity: 0.05 }} />
                <div className="absolute -left-24 -bottom-24 w-72 h-72 rounded-full pointer-events-none" style={{ background: 'var(--color-tertiary)', filter: 'blur(80px)', opacity: 0.05 }} />
                
                <div className="text-center md:text-left relative z-10 max-w-xl">
                  <h4 className="text-2xl md:text-3xl font-black tracking-tight mb-3" style={{ color: 'var(--color-on-surface)' }}>Ready to make an impact?</h4>
                  <p className="text-base md:text-lg font-medium leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>Join the movement. Whether you&apos;re a tradesperson or a backer, BuildBridge is your platform.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 relative z-10 shrink-0">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                    <Link href="/how-it-works" className="block w-full">
                      <Button variant="outline" size="lg" className="rounded-full w-full sm:w-auto text-base px-8 font-black border-2 hover:bg-primary/5 transition-colors whitespace-nowrap">
                        How It Works
                      </Button>
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                    <Link href="/browse" className="block w-full">
                      <Button size="lg" className="rounded-full flex items-center justify-center gap-2 w-full sm:w-auto text-base px-8 font-black shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap">
                        Browse Needs <ArrowRight size={18} className="ml-1" />
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </motion.div>

            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
