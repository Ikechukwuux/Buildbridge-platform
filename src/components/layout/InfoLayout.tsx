"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface InfoLayoutProps {
  children: React.ReactNode;
  heroTitle: string;
  heroSubtitle?: string;
}

export const InfoLayout: React.FC<InfoLayoutProps> = ({
  children,
  heroTitle,
  heroSubtitle,
}) => {
  return (
    <div className="min-h-screen mesh-bg pt-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 pt-0 pb-16 sm:pt-8 sm:pb-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >


            <div className="flex flex-col items-center text-center">
              <h1 className="text-display-large text-gradient font-bold tracking-tight mb-4">
                {heroTitle}
              </h1>
              
              {heroSubtitle && (
                <p className="text-headline-small text-on-surface-variant max-w-3xl font-light">
                  {heroSubtitle}
                </p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Decorative blobs */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Content Section */}
      <section className="px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-4xl mx-auto glass-card p-8 sm:p-12 rounded-3xl shadow-premium relative z-10"
        >
          {children}
        </motion.div>
      </section>

      {/* Secondary CTA */}
      <div className="mt-16 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Link href="/browse">
            <Button size="lg" className="rounded-full px-8 shadow-premium shadow-primary/20">
              Ready to support a tradesperson?
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};
