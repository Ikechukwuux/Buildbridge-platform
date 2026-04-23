"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Eye, EyeOff, Lock, Mail, Phone, User, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccountCreationViewProps {
  onBack: () => void;
  onSubmit: (data: any) => void;
  onGoogleAuth?: () => void;
  isLoading: boolean;
}

export function AccountCreationView({ onBack, onSubmit, onGoogleAuth, isLoading }: AccountCreationViewProps) {
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState(""); // Email or Phone
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ name: false, identifier: false, password: false });

  // --- Validation logic ---
  const isEmail = identifier.includes("@");
  const isPhone = /^\d+$/.test(identifier.replace(/[\s-+()]/g, ''));

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^0\d{10}$|^\d{10}$/; // 11 digits starting with 0, or 10 digits

  const isAllowedDomain = (email: string) => {
    if (email.toLowerCase() === "kolowolesegun@demo.com") return true;
    const domain = email.split('@')[1]?.toLowerCase();
    const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'];
    return allowedDomains.includes(domain);
  };

  const identifierError = useMemo(() => {
    if (!identifier) return "";
    if (isEmail) {
      if (!emailRegex.test(identifier)) {
        return "Please enter a valid email address.";
      }
      if (!isAllowedDomain(identifier)) {
        return "Please use a common email provider (e.g. Gmail) or phone number.";
      }
    } else if (isPhone) {
      const cleaned = identifier.replace(/[\s-+()]/g, '');
      if (!phoneRegex.test(cleaned)) {
        return "Enter 11 digits starting with 0, or 10 digits.";
      }
    } else if (identifier.length > 0) {
      return "Enter a valid email or phone number.";
    }
    return "";
  }, [identifier, isEmail, isPhone]);

  const passwordError = useMemo(() => {
    if (!password) return "";
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (!/\d/.test(password)) return "Password must contain at least 1 number.";
    return "";
  }, [password]);

  const passwordStrength = useMemo(() => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/\d/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  }, [password]);

  const isFormValid = name.trim().length >= 2 && identifier && !identifierError && password.length >= 8 && !passwordError;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, identifier: true, password: true });
    if (isFormValid) {
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
              onBlur={() => setTouched(t => ({ ...t, name: true }))}
              className="w-full h-18 rounded-2xl border-2 border-outline-variant focus:border-primary px-16 font-bold text-lg outline-none transition-all"
              required
            />
            <p className="text-[11px] font-bold text-on-surface-variant/60 ml-6 uppercase tracking-wider">This can be a nickname if you prefer privacy.</p>
          </div>

          <div className="flex flex-col gap-1">
            <div className="relative group">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
              <input 
                type="text"
                placeholder="Email or Phone Number"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, identifier: true }))}
                className={cn(
                  "w-full h-18 rounded-2xl border-2 px-16 font-bold text-lg outline-none transition-all",
                  touched.identifier && identifierError
                    ? "border-error focus:border-error"
                    : "border-outline-variant focus:border-primary"
                )}
                required
              />
            </div>
            {touched.identifier && identifierError && (
              <p className="text-error text-xs font-bold pl-6 mt-1">{identifierError}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <div className="relative group">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="Password (min. 8 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, password: true }))}
                className={cn(
                  "w-full h-18 rounded-2xl border-2 px-16 font-bold text-lg outline-none transition-all",
                  touched.password && passwordError
                    ? "border-error focus:border-error"
                    : "border-outline-variant focus:border-primary"
                )}
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
            {touched.password && passwordError && (
              <p className="text-error text-xs font-bold pl-6 mt-1">{passwordError}</p>
            )}
            {/* Password strength indicator */}
            {password && (
              <div className="flex gap-1.5 px-6 mt-1">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={cn(
                      "h-1 flex-1 rounded-full transition-all",
                      passwordStrength >= level
                        ? level <= 1 ? "bg-error" : level <= 2 ? "bg-yellow-500" : "bg-green-500"
                        : "bg-outline-variant/30"
                    )}
                  />
                ))}
                <span className="text-[10px] font-bold text-on-surface-variant ml-2">
                  {passwordStrength <= 1 ? "Weak" : passwordStrength <= 2 ? "Fair" : passwordStrength <= 3 ? "Good" : "Strong"}
                </span>
              </div>
            )}
          </div>
        </div>

        <Button
          type="submit"
          isLoading={isLoading}
          disabled={!isFormValid || isLoading}
          className="h-18 rounded-full text-lg font-black shadow-xl shadow-primary/20 mt-2"
        >
          <span>Create My Account</span>
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </form>

      {/* OR divider */}
      {onGoogleAuth && (
        <>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-label-medium text-on-surface-variant font-bold">
                OR
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onGoogleAuth}
            disabled={isLoading}
            className="w-full h-18 rounded-full border-2 border-outline-variant hover:border-primary transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-label-large font-bold text-on-surface">
              Sign up with Google
            </span>
          </button>
        </>
      )}
    </motion.div>
  );
}
