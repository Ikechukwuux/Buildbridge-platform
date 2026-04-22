"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { NeedStepFlow } from "./NeedStepFlow";
import { AccountCreationView } from "./AccountCreationView";
import { registerUserAdmin, syncUserRecord } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Sparkles } from "lucide-react";

export function HighVelocityAuth() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [step, setStep] = useState<"discovery" | "account">("discovery");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Form State
  const [discoveryData, setDiscoveryData] = useState<any>(null);
  const [accountData, setAccountData] = useState<any>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check for existing session
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push("/dashboard");
      }
    };
    checkSession();
  }, [supabase, router]);

  const handleDiscoveryComplete = (data: any) => {
    setDiscoveryData(data);
    setStep("account");
  };

  const handleSkipToAccount = () => {
    setDiscoveryData(null);
    setStep("account");
  };

  const handleAccountSubmit = async (data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      setAccountData(data);
      
      // 1. Use Admin Registration to bypass verification & rate limits
      const res = await registerUserAdmin({
        identifier: data.identifier,
        name: data.name,
        password: data.password
      });

      if (!res.success) throw new Error(res.error);

      // 2. Sign in locally to establish session
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: res.email!,
        password: data.password
      });

      if (loginError) throw loginError;

      // 3. Create Need if discovery data exists
      if (discoveryData?.category) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', res.userId)
          .single();

        if (profile) {
          const deadlineDate = new Date();
          deadlineDate.setDate(deadlineDate.getDate() + 30);

          await supabase.from('needs').insert({
            profile_id: profile.id,
            item_name: discoveryData.itemName,
            item_cost: parseFloat(discoveryData.cost),
            story: (discoveryData.story || "").substring(0, 150),
            impact_statement: (discoveryData.impact || "").substring(0, 200),
            status: 'active',
            deadline: deadlineDate.toISOString().split('T')[0],
            photo_url: discoveryData.photoUrl || "/images/placeholders/need-default.png"
          });
        }
      }

      // Success! Go to dashboard
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message || "Signup failed. Please try again.");
      setIsLoading(false);
    }
  };

  if (!isMounted) return <div className="h-[600px] w-full max-w-xl bg-white/10 animate-pulse rounded-[2.5rem] border border-white/20" />;

  return (
    <Card hoverLift className="w-full max-w-xl mx-auto p-10 shadow-2xl rounded-[2.5rem] border-primary/10 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <Sparkles className="w-24 h-24 text-primary" />
      </div>
      <AnimatePresence mode="wait">
        {step === "discovery" && (
          <NeedStepFlow 
            key="discovery"
            onComplete={handleDiscoveryComplete}
            onSkip={handleSkipToAccount}
          />
        )}

        {step === "account" && (
          <AccountCreationView 
            key="account"
            onBack={() => setStep("discovery")}
            onSubmit={handleAccountSubmit}
            isLoading={isLoading}
          />
        )}
      </AnimatePresence>
      {error && (
        <p className="mt-4 text-error font-bold text-center bg-error/5 py-2 rounded-xl border border-error/10 animate-shake">{error}</p>
      )}
    </Card>
  );
}
