"use client";

import * as React from "react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, KeyRound, MailOpen } from "lucide-react";

type Step = "request" | "sent";

export function ForgotPasswordForm() {
  const supabase = createClient();

  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/reset-password`
          : "/reset-password";

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (error) {
        setErrorMsg(error.message || "Failed to send reset email. Please try again.");
      } else {
        setStep("sent");
      }
    } catch {
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Success state ── */
  if (step === "sent") {
    return (
      <Card className="w-full max-w-lg p-10 shadow-2xl rounded-[2.5rem] border-primary/10 overflow-hidden relative">
        {/* Decorative bg */}
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <MailOpen className="w-24 h-24 text-primary" />
        </div>

        <div className="flex flex-col gap-6 items-center text-center relative z-10">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-black text-on-surface tracking-tight">
              Check your{" "}
              <span className="text-primary italic">inbox</span>
            </h1>
            <p className="text-on-surface-variant font-medium leading-relaxed">
              We've sent a password reset link to{" "}
              <span className="font-black text-on-surface">{email}</span>.
              It may take a minute or two to arrive.
            </p>
          </div>

          <div className="w-full p-4 bg-primary/5 border border-primary/15 rounded-2xl text-sm text-on-surface-variant font-medium text-left">
            <p className="font-bold text-on-surface mb-1">Didn't get the email?</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Check your spam or junk folder</li>
              <li>Make sure you used the correct email address</li>
              <li>
                <button
                  onClick={() => setStep("request")}
                  className="text-primary font-black hover:underline"
                >
                  Try sending again
                </button>
              </li>
            </ul>
          </div>

          <Link
            href="/login"
            className="flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      </Card>
    );
  }

  /* ── Request form ── */
  return (
    <Card className="w-full max-w-lg p-10 shadow-2xl rounded-[2.5rem] border-primary/10 overflow-hidden relative">
      {/* Decorative bg */}
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <KeyRound className="w-24 h-24 text-primary" />
      </div>

      <div className="flex flex-col gap-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col gap-3 text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-1">
            <KeyRound className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-black text-on-surface tracking-tight">
            Forgot{" "}
            <span className="text-primary italic">Password?</span>
          </h1>
          <p className="text-on-surface-variant font-medium leading-relaxed">
            No worries. Enter your account email and we'll send you a secure
            reset link right away.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errorMsg) setErrorMsg(null);
            }}
            placeholder="e.g. hello@buildbridge.app"
            autoComplete="email"
            className="h-16 rounded-3xl text-lg font-bold border-2 focus:border-primary transition-all"
            required
          />

          {errorMsg && (
            <p className="text-sm font-bold text-error text-center bg-error/5 py-3 px-4 rounded-xl border border-error/10">
              {errorMsg}
            </p>
          )}

          <Button
            type="submit"
            isLoading={isLoading}
            className="h-16 rounded-2xl text-lg font-black shadow-xl shadow-primary/20"
            disabled={!email}
          >
            <span>Send Reset Link</span>
          </Button>
        </form>

        {/* Back to login */}
        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      </div>
    </Card>
  );
}
