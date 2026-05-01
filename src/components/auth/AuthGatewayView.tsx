"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Mail, ArrowRight, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface AuthGatewayViewProps {
  onEmailSelect: () => void;
  isLoading: boolean;
}

export function AuthGatewayView({ onEmailSelect, isLoading }: AuthGatewayViewProps) {
  const supabase = createClient();

  const handleGoogleAuth = async () => {
    // Redirect to a specialized callback that knows how to handle the personalization step
    const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/signup&flow=high-velocity`;

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-10 w-full"
    >
      <div className="flex flex-col gap-3 text-center">
        <h1 className="text-4xl font-black text-on-surface tracking-tight">Get <span className="text-primary italic">Started.</span></h1>
        <p className="text-on-surface-variant font-medium leading-relaxed">
          Create your BuildBridge account in seconds.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Button
          onClick={onEmailSelect}
          variant="outline"
          className="h-16 rounded-[2rem] border-2 border-outline-variant hover:border-primary text-lg font-black bg-white shadow-xl shadow-primary/5 transition-all flex items-center justify-center gap-3 active:scale-95"
        >
          <Mail className="w-5 h-5 text-primary" />
          <span>Continue with Email</span>
        </Button>

        <div className="flex items-center gap-4 py-2">
          <div className="h-px bg-outline-variant flex-1 opacity-50" />
          <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40">or use google</span>
          <div className="h-px bg-outline-variant flex-1 opacity-50" />
        </div>

        <Button
          onClick={handleGoogleAuth}
          isLoading={isLoading}
          variant="secondary"
          className="w-full h-16 rounded-[2rem] text-lg font-black flex items-center justify-center gap-3 active:scale-95"
        >
          <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          <span>Continue with Google</span>
        </Button>
      </div>

      <div className="flex justify-center items-center gap-8 opacity-40 grayscale group-hover:grayscale-0 transition-all">
        <Sparkles className="w-6 h-6" />
        <div className="text-[10px] font-black uppercase tracking-[0.3em]">Built for Nigeria</div>
        <Sparkles className="w-6 h-6" />
      </div>

      <div className="text-center text-sm font-bold text-on-surface-variant/60 uppercase tracking-widest mt-2 px-2">
        Already have an account?{" "}
        <Link href="/login" className="text-primary font-black hover:underline ml-1">
          Log in
        </Link>
      </div>
    </motion.div>
  );
}
