"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Eye, EyeOff, Lock } from "lucide-react";

type Step = "form" | "success";

export function ResetPasswordForm() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState<Step>("form");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [sessionReady, setSessionReady] = useState(false);

  /* ── Wait for Supabase to pick up the hash token from the email link ── */
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setSessionReady(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [supabase]);

  const passwordStrength = () => {
    if (password.length === 0) return null;
    if (password.length < 6) return { label: "Too short", color: "bg-error" };
    if (password.length < 8) return { label: "Weak", color: "bg-orange-400" };
    if (/[A-Z]/.test(password) && /[0-9]/.test(password))
      return { label: "Strong", color: "bg-green-500" };
    return { label: "Fair", color: "bg-yellow-400" };
  };
  const strength = passwordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password !== confirm) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setErrorMsg(error.message || "Failed to update password. Please try again.");
      } else {
        setStep("success");
      }
    } catch {
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Success state ── */
  if (step === "success") {
    return (
      <Card className="w-full max-w-lg p-10 shadow-2xl rounded-[2.5rem] border-primary/10 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Lock className="w-24 h-24 text-primary" />
        </div>

        <div className="flex flex-col gap-6 items-center text-center relative z-10">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-black text-on-surface tracking-tight">
              Password{" "}
              <span className="text-primary italic">Updated!</span>
            </h1>
            <p className="text-on-surface-variant font-medium leading-relaxed">
              Your password has been reset successfully. You can now log in with
              your new password.
            </p>
          </div>

          <Button
            onClick={() => router.push("/login")}
            className="h-16 w-full rounded-2xl text-lg font-black shadow-xl shadow-primary/20"
          >
            <span>Go to Login</span>
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </Card>
    );
  }

  /* ── Reset form ── */
  return (
    <Card className="w-full max-w-lg p-10 shadow-2xl rounded-[2.5rem] border-primary/10 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <Lock className="w-24 h-24 text-primary" />
      </div>

      <div className="flex flex-col gap-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col gap-3 text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-1">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-black text-on-surface tracking-tight">
            New{" "}
            <span className="text-primary italic">Password</span>
          </h1>
          <p className="text-on-surface-variant font-medium leading-relaxed">
            Choose a strong password to secure your account.
          </p>
        </div>

        {!sessionReady && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-sm text-amber-800 font-medium text-center">
            ⏳ Verifying your reset link… If this persists, please{" "}
            <Link href="/forgot-password" className="font-black text-primary hover:underline">
              request a new one
            </Link>
            .
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Password field */}
          <div className="relative">
            <Input
              label="New Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="At least 8 characters"
              className="h-16 rounded-3xl text-lg font-bold border-2 focus:border-primary transition-all pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[64px] -translate-y-1/2 text-on-surface-variant/50 hover:text-primary transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>

            {/* Strength bar */}
            {strength && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-outline-variant/30 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${strength.color} ${
                      strength.label === "Too short"
                        ? "w-1/4"
                        : strength.label === "Weak"
                        ? "w-2/4"
                        : strength.label === "Fair"
                        ? "w-3/4"
                        : "w-full"
                    }`}
                  />
                </div>
                <span className="text-xs font-bold text-on-surface-variant shrink-0">
                  {strength.label}
                </span>
              </div>
            )}
          </div>

          {/* Confirm field */}
          <div className="relative">
            <Input
              label="Confirm New Password"
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={(e) => {
                setConfirm(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="Repeat your new password"
              className="h-16 rounded-3xl text-lg font-bold border-2 focus:border-primary transition-all pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-[64px] -translate-y-1/2 text-on-surface-variant/50 hover:text-primary transition-colors"
            >
              {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {errorMsg && (
            <p className="text-sm font-bold text-error text-center bg-error/5 py-3 px-4 rounded-xl border border-error/10">
              {errorMsg}
            </p>
          )}

          <Button
            type="submit"
            isLoading={isLoading}
            className="h-16 rounded-2xl text-lg font-black shadow-xl shadow-primary/20"
            disabled={!password || !confirm || !sessionReady}
          >
            <span>Update Password</span>
            {!isLoading && <ArrowRight className="ml-2 w-5 h-5" />}
          </Button>
        </form>
      </div>
    </Card>
  );
}
