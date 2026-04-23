"use client";

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import Link from "next/link"
import { Lock, Mail, ArrowRight, Eye, EyeOff, Sparkles } from "lucide-react"
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
  const [identifier, setIdentifier] = useState("") // Email or Phone
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
      // Clear any URL params
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
      
      let decodedError = errorDescription || error;
      if (decodedError) {
        try {
          decodedError = decodeURIComponent(decodedError.replace(/\+/g, ' '));
        } catch (e) {
          console.warn('Failed to decode error description:', e);
        }
      }

      setOauthError(`Google OAuth failed: ${decodedError || 'Unknown error'}`);
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
        options: {
          redirectTo
        }
      })
    } catch (error) {
      console.error('Google OAuth error:', error)
      setErrorMsg('Failed to sign in with Google. Please try again.')
      setIsLoading(false)
    }
  }

  // Handle Password Login
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg(null)

    // Handle identifier (Email or Phone)
    let email = identifier.trim()
    const isEmail = email.includes("@")
    
    if (!isEmail) {
      // If it looks like a phone number, format it and create the proxy email
      let cleanPhone = email
      if (cleanPhone.startsWith("0") && cleanPhone.length === 11) {
        cleanPhone = "+234" + cleanPhone.slice(1)
      } else if (!cleanPhone.startsWith("+") && cleanPhone.length >= 10) {
        cleanPhone = "+234" + cleanPhone
      }
      email = `${cleanPhone.replace(/[^0-9]/g, '')}@buildbridge.app`
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        setErrorMsg(error.message === "Invalid login credentials" ? "Invalid email/phone or password." : error.message)
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
    <Card hoverLift className="w-full max-w-lg p-10 shadow-2xl rounded-[2.5rem] border-primary/10 overflow-hidden relative bg-surface/80 backdrop-blur-xl">
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <Sparkles className="w-24 h-24 text-primary" />
      </div>

      <div className="flex flex-col gap-8 relative z-10">
        <div className="flex flex-col gap-3 text-center">
          <h1 className="text-4xl font-black text-on-surface tracking-tight">Welcome <span className="text-primary italic">Back.</span></h1>
          <p className="text-on-surface-variant font-medium leading-relaxed">
            Securely access your BuildBridge account.
          </p>
        </div>

        {oauthError && (
          <div className="p-4 bg-error/5 border border-error/20 rounded-2xl text-center animate-shake">
            <p className="text-error font-bold mb-2">{oauthError}</p>
            <Link href="/signup" className="text-primary font-black hover:underline">
              Sign up here
            </Link>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <Button 
            onClick={handleGoogleAuth} 
            isLoading={isLoading && !identifier} 
            className="h-18 rounded-2xl bg-white border-2 border-outline-variant text-on-surface hover:bg-surface-variant justify-center gap-3 font-bold text-lg shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </Button>
          
          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-outline-variant/30"></div>
            <span className="flex-shrink-0 mx-4 text-on-surface-variant/40 text-[10px] font-black uppercase tracking-[0.2em]">OR LOGIN WITH PASSWORD</span>
            <div className="flex-grow border-t border-outline-variant/30"></div>
          </div>
        </div>

        <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="relative group">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
              <input 
                type="text"
                placeholder="Email or Phone Number"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full h-18 rounded-2xl border-2 border-outline-variant focus:border-primary px-16 font-bold text-lg outline-none transition-all bg-transparent"
                required
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-18 rounded-2xl border-2 border-outline-variant focus:border-primary px-16 font-bold text-lg outline-none transition-all bg-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {errorMsg && <p className="text-sm font-bold text-error text-center bg-error/5 py-3 rounded-xl border border-error/10 animate-shake">{errorMsg}</p>}

          <Button
            type="submit"
            isLoading={isLoading && !!identifier}
            disabled={!identifier || !password}
            className="h-18 rounded-full text-lg font-black shadow-xl shadow-primary/20"
          >
            <span>Log In</span>
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>

          <div className="text-center text-sm font-bold text-on-surface-variant/60 uppercase tracking-widest mt-2 px-2">
            New to BuildBridge?{" "}
            <Link href="/signup" className="text-primary font-black hover:underline ml-1">
              Create an account
            </Link>
          </div>
        </form>
      </div>
    </Card>
  )
}
