"use client";

import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { 
  Scissors, Hammer, ChefHat, Flame, Watch, 
  Store, Zap, Droplets, Sparkles, Shirt,
  UserPlus, Check, Camera, Eye, EyeOff, Lock
} from "lucide-react";
import { cn } from "@/lib/utils";

const TRADE_CHIPS = [
  { id: "tailor", label: "Tailor", icon: Scissors, color: "text-purple-500", bg: "bg-purple-100" },
  { id: "carpenter", label: "Carpenter", icon: Hammer, color: "text-amber-600", bg: "bg-amber-100" },
  { id: "baker", label: "Baker", icon: ChefHat, color: "text-yellow-600", bg: "bg-yellow-100" },
  { id: "electrician", label: "Electrician", icon: Zap, color: "text-cyan-500", bg: "bg-cyan-100" },
  { id: "hair_stylist", label: "Barber", icon: Sparkles, color: "text-rose-500", bg: "bg-rose-100" },
  { id: "photographer", label: "Photographer", icon: Camera, color: "text-blue-600", bg: "bg-blue-100" },
  { id: "other", label: "Other", icon: UserPlus, color: "text-gray-500", bg: "bg-gray-100" },
];

interface PersonalizationViewProps {
  initialName?: string;
  onSubmit: (data: { name: string, trade: string, password: string }) => Promise<void>;
  isLoading: boolean;
  error?: string | null;
}

export function PersonalizationView({ initialName = "", onSubmit, isLoading, error: backendError }: PersonalizationViewProps) {
  const [name, setName] = useState(initialName);
  const [selectedTrade, setSelectedTrade] = useState<string | null>(null);
  const [customTrade, setCustomTrade] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [step, setStep] = useState<"profile" | "security">("profile");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleNextToSecurity = () => {
    if (!name.trim()) return;
    setStep("security");
  };

  const handleFinish = () => {
    setPasswordError(null);

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    const finalTrade = selectedTrade === "other" ? customTrade.trim() : (selectedTrade || "other");
    onSubmit({ name: name.trim(), trade: finalTrade || "other", password });
  };

  const isFormValid = name.trim() && password.length >= 8 && password === confirmPassword;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-10 w-full"
    >
      <div className="flex flex-col gap-4 text-center">
        <h1 className="text-4xl font-black text-on-surface tracking-tight">
          {step === "profile" ? (
            <>Personalize your <span className="text-primary italic">Profile.</span></>
          ) : (
            <>Secure your <span className="text-primary italic">Account.</span></>
          )}
        </h1>
        <p className="text-on-surface-variant font-medium">
          {step === "profile" ? "Almost there! Tell us a bit about you." : "Create a password for your next login."}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {step === "profile" ? (
          <motion.div
            key="profile"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-8"
          >
            {/* Name Input */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant/60 ml-4">What's your name?</label>
              <Input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                autoFocus
                className="h-20 text-2xl font-black rounded-[2rem] border-2 border-outline-variant focus:border-primary px-8 shadow-inner transition-all text-center placeholder:opacity-20"
              />
            </div>

            {/* Trade Selection */}
            <div className="flex flex-col gap-4">
              <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant/60 ml-4">What is your trade? <span className="font-medium lowercase italic opacity-50">(Optional)</span></label>
              
              <div className="flex flex-wrap gap-3 p-2">
                {TRADE_CHIPS.map((trade) => (
                  <button
                    key={trade.id}
                    onClick={() => setSelectedTrade(trade.id)}
                    className={cn(
                      "flex items-center gap-2 px-5 py-3 rounded-full border-2 transition-all active:scale-95 text-sm font-black whitespace-nowrap",
                      selectedTrade === trade.id
                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105"
                        : "bg-white text-on-surface-variant border-outline-variant hover:border-primary/30"
                    )}
                  >
                    <trade.icon className={cn("w-4 h-4", selectedTrade === trade.id ? "text-white" : trade.color)} />
                    <span>{trade.label}</span>
                    {selectedTrade === trade.id && <Check className="w-4 h-4 ml-1" />}
                  </button>
                ))}
              </div>

              {selectedTrade === "other" && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="px-2"
                >
                  <Input 
                    placeholder="What is your trade?"
                    value={customTrade}
                    onChange={(e) => setCustomTrade(e.target.value)}
                    className="h-16 rounded-2xl border-2 focus:border-primary placeholder:opacity-20"
                    autoFocus
                  />
                </motion.div>
              )}
            </div>

            <Button
              onClick={handleNextToSecurity}
              disabled={!name.trim()}
              className="h-20 rounded-[2rem] text-xl font-black shadow-2xl shadow-primary/20 mt-4 active:scale-[0.98]"
            >
              Next: Set Password
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="security"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-8"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 ml-4">
                <Lock className="w-4 h-4 text-primary" />
                <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant/60">Create a Secure Password</label>
              </div>
              
              <div className="flex flex-col gap-3 px-2">
                {/* Password Input */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setPasswordError(null); }}
                    placeholder="Min 8 characters"
                    autoFocus
                    className={cn(
                      "w-full h-16 rounded-2xl border-2 px-6 pr-14 font-bold text-on-surface transition-all outline-none text-lg",
                      passwordError ? "border-error focus:border-error" : "border-outline-variant focus:border-primary"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-on-surface-variant transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Confirm Password Input */}
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError(null); }}
                    placeholder="Confirm password"
                    className={cn(
                      "w-full h-16 rounded-2xl border-2 px-6 pr-14 font-bold text-on-surface transition-all outline-none text-lg",
                      passwordError ? "border-error focus:border-error" : "border-outline-variant focus:border-primary"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-on-surface-variant transition-colors"
                  >
                    {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {password.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="flex flex-col gap-2 px-2"
                  >
                    <div className="flex gap-2">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={cn(
                            "h-1.5 flex-1 rounded-full transition-all duration-300",
                            password.length >= level * 3
                              ? password.length >= 12 ? "bg-green-500" : password.length >= 8 ? "bg-primary" : "bg-yellow-500"
                              : "bg-outline-variant/30"
                          )}
                        />
                      ))}
                    </div>
                    <p className={cn(
                      "text-[10px] font-black uppercase tracking-widest",
                      password.length >= 12 ? "text-green-500" : password.length >= 8 ? "text-primary" : "text-yellow-500"
                    )}>
                      {password.length >= 12 ? "Strong password" : password.length >= 8 ? "Good password" : "Too short (min 8)"}
                    </p>
                  </motion.div>
                )}

                {/* Password Error */}
                {passwordError && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm font-bold text-error text-center bg-error/5 p-3 rounded-xl border border-error/20"
                  >
                    {passwordError}
                  </motion.p>
                )}

                {/* Backend Error */}
                {backendError && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm font-bold text-error text-center bg-error/5 p-3 rounded-xl border border-error/20"
                  >
                    {backendError}
                  </motion.p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Button
                onClick={handleFinish}
                isLoading={isLoading}
                disabled={password.length < 8 || password !== confirmPassword}
                className="h-20 rounded-[2rem] text-xl font-black shadow-2xl shadow-primary/20 active:scale-[0.98]"
              >
                {isLoading ? "Finalizing..." : "Complete Registration"}
              </Button>
              <button 
                onClick={() => setStep("profile")}
                className="text-xs font-black text-on-surface-variant hover:text-primary transition-colors uppercase tracking-widest"
              >
                ← Back to Profile
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
