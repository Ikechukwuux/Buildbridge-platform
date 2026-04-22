"use client";

import * as React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import Link from "next/link"
import { Phone, ArrowRight, ShieldCheck, Sparkles, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  // View State
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [oauthError, setOauthError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Form State
  const [identifier, setIdentifier] = useState("") // Phone or Email
  const [password, setPassword] = useState("")

  // Check for OAuth errors on mount
  useEffect(() => {
    const error = searchParams?.get('error')
    const email = searchParams?.get('email')
    const phoneParam = searchParams?.get('phone')

    if (phoneParam) {
      setIdentifier(phoneParam)
    }

    if (error === 'no_account') {
      const message = email
        ? `No account found with email ${email}. Please sign up first.`
        : 'No account found. Please sign up first.'
      setOauthError(message)
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('error')
      newUrl.searchParams.delete('email')
      window.history.replaceState({}, '', newUrl.toString())
    }
  }, [searchParams])

  // Check for OAuth errors from hash fragment
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (hash && hash.includes('error=')) {
      const params = new URLSearchParams(hash.slice(1));
      const error = params.get('error');
      const errorDescription = params.get('error_description');
      setOauthError(`Google OAuth failed: ${errorDescription || error || 'Unknown error'}`);
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, [])

  // Handle Google OAuth
  const handleGoogleAuth = async () => {
    setIsLoading(true)
    setErrorMsg(null)
    setOauthError(null)
    try {
      document.cookie = `auth_flow=login; path=/; max-age=300; SameSite=Lax`;
      document.cookie = `auth_next=/dashboard; path=/; max-age=300; SameSite=Lax`;

      const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
      const redirectTo = `${baseUrl}/auth/callback`
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo }
      })
    } catch (error) {
      setErrorMsg('Failed to sign in with Google.')
      setIsLoading(false)
    }
  }

  // Handle Password Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg(null)

    let email = identifier.trim()
    if (!email.includes("@")) {
      // Format phone to pseudo-email
      let clean = email;
      if (clean.startsWith("0") && clean.length === 11) clean = "+234" + clean.slice(1);
      else if (!clean.startsWith("+")) clean = "+234" + clean;
      email = `${clean.replace(/[^0-9]/g, '')}@buildbridge.app`
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        setErrorMsg(error.message || "Invalid credentials.")
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      setErrorMsg("An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-lg p-10 shadow-2xl rounded-[2.5rem] border-primary/10 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <Sparkles className="w-24 h-24 text-primary" />
      </div>

      {step === "enter" ? (
        <div className="flex flex-col gap-8 relative z-10">
          <div className="flex flex-col gap-3 text-center">
            <h1 className="text-4xl font-black text-on-surface tracking-tight">Welcome <span className="text-primary italic">Back.</span></h1>
            <p className="text-on-surface-variant font-medium leading-relaxed">
              Securely access your BuildBridge account.
            </p>
          </div>

          {oauthError && (
            <div className="p-4 bg-error/5 border border-error/20 rounded-2xl text-center">
              <p className="text-error font-bold mb-2">{oauthError}</p>
              <Link href="/signup" className="text-primary font-black hover:underline">
                Sign up here
              </Link>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <Button onClick={handleGoogleAuth} isLoading={isLoading} className="h-16 rounded-2xl bg-surface border-2 border-outline-variant text-on-surface hover:bg-surface-variant justify-center gap-3 font-bold text-lg shadow-sm">
              <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
              Continue with Google
            </Button>
            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-outline-variant/50"></div>
              <span className="flex-shrink-0 mx-4 text-on-surface-variant text-label-small font-bold uppercase tracking-widest">OR</span>
              <div className="flex-grow border-t border-outline-variant/50"></div>
            </div>
          </div>

          <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 relative">
              <Input
                label="Phone Number"
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value)
                  if (oauthError) setOauthError(null)
                }}
                placeholder="0801 234 5678"
                autoComplete="tel"
                error={errorMsg || undefined}
                className="h-16 rounded-3xl text-lg font-bold border-2 focus:border-primary transition-all"
                required
              />
            </div>

            <div className="flex flex-col gap-4">
              <Button
                type="submit"
                isLoading={isLoading}
                className="h-16 rounded-full text-lg font-black shadow-xl shadow-primary/20"
                disabled={phone.length < 10}
              >
                <span>Continue with OTP</span>
                {!isLoading && <ArrowRight className="ml-2 w-5 h-5" />}
              </Button>

              <button
                type="button"
                onClick={() => setStep("password")}
                className="text-xs font-black text-primary hover:underline uppercase tracking-widest text-center"
              >
                Or Login with Password
              </button>
            </div>
          </form>

        {oauthError && (
          <div className="p-4 bg-error/5 border border-error/20 rounded-2xl text-center">
            <p className="text-error font-bold mb-2">{oauthError}</p>
            <Link href="/signup" className="text-primary font-black hover:underline">
              Sign up here
            </Link>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <Button onClick={handleGoogleAuth} isLoading={isLoading} className="h-16 rounded-2xl bg-surface border-2 border-outline-variant text-on-surface hover:bg-surface-variant justify-center gap-3 font-bold text-lg shadow-sm">
            <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
            Continue with Google
          </Button>
          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-outline-variant/50"></div>
            <span className="flex-shrink-0 mx-4 text-on-surface-variant text-label-small font-bold uppercase tracking-widest">OR</span>
            <div className="flex-grow border-t border-outline-variant/50"></div>
          </div>
        </div>

        <form onSubmit={handleLoginSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <Input
              label="Phone or Email"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="0801 234 5678 or name@email.com"
              className="h-16 rounded-3xl text-lg font-bold border-2 focus:border-primary transition-all"
              required
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="h-16 rounded-3xl text-lg font-bold border-2 focus:border-primary transition-all pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[38px] text-on-surface-variant/40 hover:text-primary transition-colors p-2"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {errorMsg && <p className="text-sm font-bold text-error text-center bg-error/5 py-2 rounded-xl border border-error/10 animate-shake">{errorMsg}</p>}

          <div className="flex flex-col gap-4">
            <Button type="submit" isLoading={isLoading} className="h-16 rounded-full text-lg font-black shadow-xl">
              Login
            </Button>
            <button
              type="button"
              onClick={() => setStep("enter")}
              className="text-xs font-black text-on-surface-variant hover:text-primary uppercase tracking-widest transition-colors"
            >
              Back to OTP Login
            </button>
          </div>
        </form>

        <div className="text-center text-sm font-bold text-on-surface-variant/60 uppercase tracking-widest mt-2 px-2">
          New to BuildBridge?{" "}
          <Link href="/signup" className="text-primary font-black hover:underline ml-1">
            Create an account
          </Link>
        </div>
      </div>
    </Card>
  )
}
