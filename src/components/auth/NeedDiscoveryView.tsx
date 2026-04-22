"use client";

import * as React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Input } from "@/components/ui/Input";
import { Sparkles, ArrowRight, Target, Hammer, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

interface NeedDiscoveryViewProps {
  onComplete: (data: { title: string, amount: string, story: string } | null) => void;
}

const NEED_TYPES = [
  { id: "tools", label: "Tools", icon: Hammer, color: "text-amber-500", bg: "bg-amber-50" },
  { id: "materials", label: "Materials", icon: ShoppingBag, color: "text-blue-500", bg: "bg-blue-50" },
  { id: "equipment", label: "Equipment", icon: Target, color: "text-purple-500", bg: "bg-purple-50" },
];

export function NeedDiscoveryView({ onComplete }: NeedDiscoveryViewProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [story, setStory] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleContinue = () => {
    if (title && amount && story) {
      onComplete({ title, amount, story });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="flex flex-col gap-8 w-full"
    >
      <div className="flex flex-col gap-3 text-center">
        <h1 className="text-4xl font-black text-on-surface tracking-tight">
          What do you <span className="text-primary italic">Need?</span>
        </h1>
        <p className="text-on-surface-variant font-medium leading-relaxed">
          Tell us what you need to grow your trade.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Need Type Chips */}
        <div className="flex justify-center gap-3">
          {NEED_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-3xl border-2 transition-all active:scale-95 flex-1 max-w-[100px]",
                selectedType === type.id
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105"
                  : "bg-white text-on-surface-variant border-outline-variant hover:border-primary/30"
              )}
            >
              <type.icon className={cn("w-6 h-6", selectedType === type.id ? "text-white" : type.color)} />
              <span className="text-[10px] font-black uppercase tracking-widest">{type.label}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <Input 
            label="What exactly do you need?"
            placeholder="e.g. Industrial Sewing Machine"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-16 rounded-2xl border-2 focus:border-primary font-bold px-6"
          />
          
          <Input 
            label="Estimated Cost (₦)"
            type="number"
            placeholder="50,000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="h-16 rounded-2xl border-2 focus:border-primary font-bold px-6"
          />

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 ml-4">Tell us your story</label>
            <Textarea 
              placeholder="Why is this important for your business?"
              value={story}
              onChange={(e) => setStory(e.target.value)}
              className="min-h-[120px] rounded-3xl border-2 focus:border-primary p-6 leading-relaxed resize-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-2">
          <Button 
            onClick={handleContinue}
            disabled={!title || !amount || !story}
            className="h-16 rounded-full text-lg font-black shadow-xl shadow-primary/20"
          >
            <span>Continue to Signup</span>
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>

          <button 
            onClick={() => onComplete(null)}
            className="text-[10px] font-black text-on-surface-variant hover:text-primary transition-colors uppercase tracking-[0.2em] text-center"
          >
            Skip and go straight to Signup →
          </button>
        </div>
      </div>
    </motion.div>
  );
}
