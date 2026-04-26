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
import { Sparkles, CheckCircle2 } from "lucide-react";
import dynamic from "next/dynamic";
import confettiAnimation from "../../../public/animations/confetti.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

function ConfettiAnimation() {
  return (
    <div className="w-[600px] h-[600px] max-w-[100vw]">
      <Lottie
        animationData={confettiAnimation}
        loop={true}
        autoplay={true}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}

export function HighVelocityAuth() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [step, setStep] = useState<"discovery" | "account">("discovery");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      // Set cookies for callback to read
      document.cookie = `auth_flow=signup; path=/; max-age=300; SameSite=Lax`;
      document.cookie = `auth_next=/dashboard; path=/; max-age=300; SameSite=Lax`;
      if (discoveryData) {
        document.cookie = `discovery_data=${encodeURIComponent(JSON.stringify(discoveryData))}; path=/; max-age=300; SameSite=Lax`;
      }

      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${baseUrl}/auth/callback`
        }
      });
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google.');
      setIsLoading(false);
    }
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
          let days = 30;
          if (discoveryData.timeline) {
            days = parseInt(discoveryData.timeline, 10);
            if (isNaN(days)) days = 30;
          }
          deadlineDate.setDate(deadlineDate.getDate() + days);

          const rawCost = String(discoveryData.cost || '0');
          const itemCostKobo = (parseInt(rawCost.replace(/[^0-9]/g, ""), 10) || 0) * 100;

          // Map trade category
          let tradeCategory = 'other';
          if (discoveryData.category) {
            const cat = discoveryData.category.toLowerCase();
            if (cat.includes('tailor')) tradeCategory = 'tailor';
            else if (cat.includes('carpenter')) tradeCategory = 'carpenter';
            else if (cat.includes('welder')) tradeCategory = 'welder';
            else if (cat.includes('cobbler') || cat.includes('shoemaker')) tradeCategory = 'cobbler_shoemaker';
            else if (cat.includes('baker') || cat.includes('food')) tradeCategory = 'baker_food';
            else if (cat.includes('mechanic')) tradeCategory = 'mechanic';
            else if (cat.includes('electrician')) tradeCategory = 'electrician';
          }

          // 1. Update the profile with location and trade data
          await supabase.from('profiles').update({
            location_state: discoveryData.state ? discoveryData.state.toLowerCase().replace(/\s+/g, '_') : null,
            location_lga: discoveryData.lga || null,
            trade_category: tradeCategory,
            trade_other_description: tradeCategory === 'other' ? discoveryData.otherCategory : null,
          }).eq('id', profile.id);

          // 2. Create the Need
          await supabase.from('needs').insert({
            profile_id: profile.id,
            item_name: discoveryData.itemName,
            item_cost: itemCostKobo,
            story: discoveryData.story || "",
            impact_statement: discoveryData.impact || "",
            status: 'pending_review',
            deadline: deadlineDate.toISOString().split('T')[0],
            photo_url: discoveryData.photoUrl || "/images/placeholders/need-default.png",
            location_state: discoveryData.state ? discoveryData.state.toLowerCase().replace(/\s+/g, '_') : null,
            location_lga: discoveryData.lga || null,
          });
        }
        
        // They completed the flow and created a need, show the success modal
        setShowSuccessModal(true);
      } else {
        // They skipped the need creation flow, just go straight to dashboard
        window.location.href = "/dashboard";
      }

    } catch (err: any) {
      setError(err.message || "Signup failed. Please try again.");
      setIsLoading(false);
    }
  };

  if (!isMounted) return <div className="h-[600px] w-full max-w-xl bg-white/10 animate-pulse rounded-[2.5rem] border border-white/20" />;

  return (
    <>
      <Card className="w-full max-w-xl mx-auto p-10 shadow-2xl rounded-[2.5rem] border-primary/10 overflow-hidden relative">
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
            onGoogleAuth={handleGoogleAuth}
            isLoading={isLoading}
          />
        )}
      </AnimatePresence>
      {error && (
        <p className="mt-4 text-error font-bold text-center bg-error/5 py-2 rounded-xl border border-error/10 animate-shake">{error}</p>
      )}
      </Card>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-[2rem] shadow-2xl border border-outline-variant/30 p-8 max-w-md w-full flex flex-col items-center text-center gap-6 relative overflow-hidden"
            >
              {/* Confetti overlay */}
              <div className="absolute inset-0 pointer-events-none -top-10 flex items-start justify-center overflow-hidden z-0">
                <ConfettiAnimation />
              </div>

              <div className="relative z-10 flex flex-col items-center gap-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                  className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center shadow-lg shadow-primary/10"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.4 }}
                  >
                    <CheckCircle2 className="w-10 h-10 text-primary" />
                  </motion.div>
                </motion.div>

                <div className="flex flex-col gap-3">
                  <h2 className="text-2xl font-black text-on-surface">Account & Need Created! 🎉</h2>
                  <p className="text-sm text-on-surface-variant font-medium leading-relaxed">
                    Your account is ready and your need has been submitted successfully. It will be reviewed within <strong className="text-on-surface">24–48 hours</strong>.
                  </p>
                  <div className="p-3 bg-amber-50 border border-amber-200/50 rounded-xl">
                    <p className="text-xs text-amber-800 font-medium">
                      It will appear on your dashboard as <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-[10px] font-black uppercase tracking-wider">Pending Review</span>
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    window.location.href = "/dashboard";
                  }}
                  className="w-full mt-2"
                >
                  Proceed to Dashboard
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
