"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthGatewayView } from "./AuthGatewayView";
import { VelocityOtpInput } from "./VelocityOtpInput";
import { PersonalizationView } from "./PersonalizationView";
import { adminSyncPhoneUser } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";

export function HighVelocityAuth() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [step, setStep] = useState<"gateway" | "otp" | "personalization">("gateway");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [formattedPhone, setFormattedPhone] = useState("");
  const [initialName, setInitialName] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check for existing session or new_user redirect
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // If we have a session, we need to check if the profile is complete
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, trade_category')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (!profile || !profile.full_name) {
          setInitialName(session.user.user_metadata?.full_name || "");
          setStep("personalization");
        } else {
          // Already have a profile, go to dashboard
          router.push("/dashboard");
        }
      }
    };

    checkSession();
  }, [supabase, router]);

  const handlePhoneSelect = () => {
    // For this simplified high-velocity flow, we'll prompt for phone on the OTP screen 
    // or just use a drawer/modal? 
    // Actually, user wants Screen 1: Google/Phone. 
    // If phone selected, show phone input.
    setStep("otp");
  };

  const handleOtpVerify = async (code: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Verify OTP with our API
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formattedPhone, code })
      });
      
      const data = await res.json();
      
      if (!res.ok || !data.success) {
        setError(data.error || "Invalid code. Try again.");
        setIsLoading(false);
        return;
      }

      // 2. Auth Success - Use admin action to sync/sign-in
      // (This matches existing architecture for phone auth)
      const email = `${formattedPhone.replace(/[^0-9]/g, '')}@buildbridge.app`;
      const password = `buildbridge-${formattedPhone.replace(/[^0-9]/g, '')}`;
      
      const syncResult = await adminSyncPhoneUser(formattedPhone, "");
      if (!syncResult.success) {
        setError("Failed to initialize account.");
        setIsLoading(false);
        return;
      }
      
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError("Authentication failed.");
        setIsLoading(false);
        return;
      }

      // 3. Check if user record already exists with a valid name
      const { data: userData } = await supabase
        .from('users')
        .select('name')
        .eq('id', signInData.user.id)
        .single();

      if (userData && userData.name && userData.name !== "Tradesperson") {
        // Account exists and is complete
        setError("Account already exists. Welcome back!");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
        return;
      }

      // 4. Move to personalization
      setStep("personalization");
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePersonalizationSubmit = async (data: { name: string, trade: string, password: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // Update Auth metadata and set the user's chosen password
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.password,
        data: { full_name: data.name }
      });

      if (updateError) {
        console.error("Auth update error:", updateError);
        // If the password is the same as the old one, it's fine - we can proceed
        if (updateError.message.toLowerCase().includes("should be different from the old")) {
          console.log("Password already matches, proceeding to profile setup.");
        } else {
          setError("Failed to set password: " + updateError.message);
          setIsLoading(false);
          return;
        }
      }

      // DB Enum validation - strictly match 001_schema.sql
      const validCategories = [
        'tailor', 'carpenter', 'welder', 'cobbler', 'food_processor',
        'market_trader', 'baker', 'mechanic', 'electrician', 'plumber',
        'hair_stylist', 'blacksmith', 'other'
      ];

      const isEnumMatch = validCategories.includes(data.trade.toLowerCase());
      
      // 2. Update/Ensure the public users record exists
      const { error: userError } = await supabase
        .from('users')
        .upsert({ 
          id: user.id, 
          name: data.name,
          phone: user.phone || formattedPhone || `+234${user.id.replace(/[^0-9]/g, '').slice(0, 10)}` 
        });

      if (userError) {
        console.error("User update error:", userError);
        // Continue anyway if it's just the users table, but log it
      }

      // 3. Create/Update the profile record
      const profilePayload: any = {
        user_id: user.id,
        updated_at: new Date().toISOString()
      };

      if (isEnumMatch) {
         profilePayload.trade_category = data.trade.toLowerCase();
      } else {
         profilePayload.trade_category = 'other';
         profilePayload.trade_other_description = data.trade;
      }

      // Update/Upsert Profile (onConflict handles pre-created trigger rows)
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(profilePayload, { onConflict: 'user_id' });

      if (profileError) {
        console.error("Profile upsert error:", profileError);
        throw profileError;
      }

      // SUCCESS! Sign out and redirect to login page
      // User needs to log in with their new credentials
      await supabase.auth.signOut();

      // Redirect to login page with pre-filled phone
      const loginUrl = `/login?phone=${encodeURIComponent(formattedPhone)}`;
      router.push(loginUrl);
      
      // Fallback: if router.push doesn't trigger navigation within 500ms, force it
      setTimeout(() => {
        window.location.href = loginUrl;
      }, 500);
    } catch (err: any) {
      console.error("Personalization submission failed:", err);
      setError(err.message || "Failed to save profile. Please try again.");
      setIsLoading(false);
    }
  };

  // UI for Phone Input before OTP
  const [phoneEntry, setPhoneEntry] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Format phone
    let clean = phoneEntry.trim();
    if (clean.startsWith("0") && clean.length === 11) clean = "+234" + clean.slice(1);
    else if (!clean.startsWith("+")) clean = "+234" + clean;

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: clean })
      });
      const data = await res.json();
      if (data.success) {
        setFormattedPhone(clean);
        setPhone(clean);
        // We are already on "otp" step logically, but we show the input first.
        // Let's refine the steps: gateway -> phone_entry -> otp -> personalization
      } else {
        setError(data.error || "Failed to send code.");
      }
    } catch (err) {
      setError("Network error.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) return <div className="h-96 w-full max-w-lg bg-white/10 animate-pulse rounded-[2.5rem] border border-white/20" />;

  return (
    <div className="w-full max-w-lg mx-auto">
      <AnimatePresence mode="wait">
        {step === "gateway" && (
          <AuthGatewayView 
            key="gateway"
            onPhoneSelect={() => setStep("otp")} 
            isLoading={isLoading} 
          />
        )}

        {step === "otp" && !formattedPhone && (
           <motion.div
             key="phone-entry"
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: -20 }}
             className="flex flex-col gap-8"
           >
             <button onClick={() => setStep("gateway")} className="self-start text-xs font-black uppercase tracking-widest opacity-50">← Back</button>
             <h1 className="text-4xl font-black text-on-surface">Enter your <span className="text-primary italic">Phone.</span></h1>
             <form onSubmit={handleSendOtp} className="flex flex-col gap-6">
                <input 
                  type="tel" 
                  value={phoneEntry}
                  onChange={(e) => setPhoneEntry(e.target.value)}
                  placeholder="0801 234 5678"
                  className="h-20 rounded-[2rem] border-2 border-outline-variant focus:border-primary text-2xl font-black px-8 shadow-inner placeholder:opacity-20"
                  autoFocus
                />
                <Button type="submit" isLoading={isLoading} className="h-16 rounded-full font-black text-lg">Send Verification Code</Button>
                {error && <p className="text-error font-bold text-center">{error}</p>}
             </form>
           </motion.div>
        )}

        {step === "otp" && formattedPhone && (
          <VelocityOtpInput 
            key="otp"
            phone={formattedPhone}
            onVerify={handleOtpVerify}
            onBack={() => setFormattedPhone("")}
            isLoading={isLoading}
            error={error}
          />
        )}

        {step === "personalization" && (
          <PersonalizationView 
            key="personalization"
            initialName={initialName}
            onSubmit={handlePersonalizationSubmit}
            isLoading={isLoading}
            error={error}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
