"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface VelocityOtpInputProps {
  phone: string;
  onVerify: (code: string) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
  error?: string | null;
}

export function VelocityOtpInput({ phone, onVerify, onBack, isLoading, error }: VelocityOtpInputProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]*$/.test(value)) return;

    const newOtp = [...otp];
    // Take last digit if multiple (e.g. from autocomplete)
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Focus next
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit
    const joined = newOtp.join("");
    if (joined.length === 6) {
      onVerify(joined);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const data = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
    if (data) {
      const newOtp = [...data.split(""), ...Array(6 - data.length).fill("")];
      setOtp(newOtp);
      if (data.length === 6) {
        onVerify(data);
      } else {
        inputRefs.current[data.length]?.focus();
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-8 w-full"
    >
      <button
        onClick={onBack}
        className="self-start flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-sm font-black uppercase tracking-widest"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="flex flex-col gap-4 text-center">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2 shadow-inner border border-primary/10">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-black text-on-surface tracking-tight">Verify Identity</h1>
        <p className="text-on-surface-variant font-medium">
          Sent to <strong className="text-on-surface">{phone}</strong>
        </p>
      </div>

      <div className="flex justify-between gap-3 sm:gap-4 px-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            autoComplete="one-time-code"
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            autoFocus={index === 0}
            disabled={isLoading}
            className={`w-full h-16 sm:h-20 text-center rounded-[1.5rem] border-2 text-3xl font-black text-on-surface focus-visible:outline-none bg-surface-variant/10 shadow-inner transition-all ${error ? 'border-error text-error' : 'border-outline-variant focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/5'
              }`}
          />
        ))}
      </div>

      {error && (
        <p className="text-sm font-bold text-error text-center bg-error/5 py-3 rounded-2xl border border-error/10 animate-shake">
          {error}
        </p>
      )}

      {isLoading && (
        <div className="flex justify-center flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-widest text-primary animate-pulse">Checking Securely...</span>
        </div>
      )}
    </motion.div>
  );
}
