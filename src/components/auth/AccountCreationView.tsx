"use client";

import * as React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Eye, EyeOff, Lock, Mail, Phone, User, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccountCreationViewProps {
  onBack: () => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export function AccountCreationView({ onBack, onSubmit, isLoading }: AccountCreationViewProps) {
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState(""); // Email or Phone
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && identifier && password.length >= 8) {
      onSubmit({ name, identifier, password });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col gap-8 w-full"
    >
      <div className="flex flex-col gap-4">
        <button 
          onClick={onBack}
          className="self-start text-[10px] font-black text-on-surface-variant hover:text-primary transition-colors uppercase tracking-[0.2em]"
        >
          ← Back
        </button>
        <div className="flex flex-col gap-3 text-center">
          <h1 className="text-4xl font-black text-on-surface tracking-tight">Create <span className="text-primary italic">Account.</span></h1>
          <p className="text-on-surface-variant font-medium leading-relaxed">
            Almost there! Just a few details to get you started.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="relative group">
            <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
            <input 
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-18 rounded-2xl border-2 border-outline-variant focus:border-primary px-16 font-bold text-lg outline-none transition-all"
              required
            />
          </div>

          <div className="relative group">
            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
            <input 
              type="text"
              placeholder="Email or Phone Number"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full h-18 rounded-2xl border-2 border-outline-variant focus:border-primary px-16 font-bold text-lg outline-none transition-all"
              required
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
            <input 
              type={showPassword ? "text" : "password"}
              placeholder="Password (min. 8 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-18 rounded-2xl border-2 border-outline-variant focus:border-primary px-16 font-bold text-lg outline-none transition-all"
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-primary transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          isLoading={isLoading}
          disabled={!name || !identifier || password.length < 8}
          className="h-18 rounded-full text-lg font-black shadow-xl shadow-primary/20 mt-2"
        >
          <span>Create My Account</span>
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </form>
    </motion.div>
  );
}
