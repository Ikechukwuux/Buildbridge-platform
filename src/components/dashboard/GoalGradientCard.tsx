"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles, Target } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface GoalGradientCardProps {
  progress: number;
  onAction: () => void;
}

export function GoalGradientCard({ progress, onAction }: GoalGradientCardProps) {
  const router = useRouter();
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden p-10 rounded-[2.5rem] bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white shadow-2xl shadow-primary/20 group"
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
        <Target className="w-32 h-32" />
      </div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex flex-col gap-4 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-widest border border-white/10 w-fit">
            <Sparkles className="w-3 h-3" />
            Next Milestone
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
            Your profile is <span className="italic underline decoration-yellow-400 decoration-4"> {progress}% ready.</span>
          </h2>
          <p className="text-white/80 font-medium text-lg leading-relaxed">
            Complete your profile to build trust and get funded faster by the community.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 shrink-0">
          {/* Progress Ring / Dashboard Dial aesthetic */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-white/20"
              />
              <motion.circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="251.2"
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ strokeDashoffset: 251.2 - (251.2 * progress) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="text-white"
              />
            </svg>
            <span className="absolute text-xl font-black">{progress}%</span>
          </div>
          
          <Button 
            onClick={() => router.push('/profile')}
            className="w-full md:w-auto h-12 px-8 rounded-[1.5rem] bg-white text-primary hover:bg-white/90 font-black shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
          >
            Finish Profile <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
