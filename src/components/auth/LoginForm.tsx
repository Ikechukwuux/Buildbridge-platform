"use client";

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import Link from "next/link"
import { ArrowRight, Sparkles, Eye, EyeOff } from "lucide-react"

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [oauthError, setOauthError] = useState<string | null>(null)

  // Check for OAuth errors on mount
  useEffect(() => {
    const error = searchParams?.get('error')
    const emailParam = searchParams?.get('email')

    if (emailParam) {
      setEmail(emailParam)
    }

    if (error === 'no_account') {
      const message = emailParam
        ? `No account found with email ${emailParam}. Please sign up first.`
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

  // Handle Password Login
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg(null)
    setOauthError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        setErrorMsg(error.message || "Invalid email or password.")
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      setErrorMsg("An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

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

  return (
    <Card className="w-full max-w-lg p-10 shadow-2xl rounded-[2.5rem] border-primary/10 overflow-hidden relative">
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
          <div className="p-4 bg-error/5 border border-error/20 rounded-2xl text-center">
            <p className="text-error font-bold mb-2">{oauthError}</p>
            <Link href="/signup" className="text-primary font-black hover:underline">
              Sign up here
            </Link>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-6">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (oauthError) setOauthError(null)
                if (errorMsg) setErrorMsg(null)
              }}
              placeholder="e.g. hello@buildbridge.app"
              autoComplete="email"
              className="h-16 rounded-3xl text-lg font-bold border-2 focus:border-primary transition-all"
              required
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (errorMsg) setErrorMsg(null)
                }}
                placeholder="Enter your password"
                className="h-16 rounded-3xl text-lg font-bold border-2 focus:border-primary transition-all pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[64px] -translate-y-1/2 text-on-surface-variant/50 hover:text-primary transition-colors flex items-center justify-center"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Forgot password link */}
            <div className="flex justify-end -mt-2">
              <Link
                href="/forgot-password"
                className="text-sm font-bold text-primary/70 hover:text-primary transition-colors hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {errorMsg && <p className="text-sm font-bold text-error text-center bg-error/5 py-2 rounded-xl border border-error/10">{errorMsg}</p>}

          <Button
            type="submit"
            isLoading={isLoading}
            className="h-16 rounded-2xl text-lg font-black shadow-xl shadow-primary/20"
            disabled={!email || password.length < 6}
          >
            <span>Login</span>
            {!isLoading && <ArrowRight className="ml-2 w-5 h-5" />}
          </Button>
        </form>

        <div className="relative flex items-center">
          <div className="flex-grow border-t border-outline-variant/50"></div>
          <span className="flex-shrink-0 mx-4 text-on-surface-variant text-label-small font-bold uppercase tracking-widest">OR</span>
          <div className="flex-grow border-t border-outline-variant/50"></div>
        </div>

        <Button 
          type="button"
          onClick={handleGoogleAuth} 
          isLoading={isLoading} 
          variant="secondary"
          className="w-full h-16 rounded-2xl justify-center gap-3 font-black text-lg"
        >
          <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
          Continue with Google
        </Button>

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

/* 
--- TWILIO OTP CONFIGURATION (COMMENTED OUT FOR FUTURE USE) ---

  // Phone State
  // const [phone, setPhone] = useState("")
  // const [formattedPhone, setFormattedPhone] = useState("")
  // const [step, setStep] = useState<"enter" | "otp" | "password">("enter")
  // const [otp, setOtp] = useState(["", "", "", "", "", ""])
  // const otpRefs = useRef<(HTMLInputElement | null)[]>([])
  // const [timeLeft, setTimeLeft] = useState(300)

  // useEffect(() => {
  //   let timer: any
  //   if (step === "otp" && timeLeft > 0) {
  //     timer = setInterval(() => {
  //       setTimeLeft((prev) => prev - 1)
  //     }, 1000)
  //   }
  //   return () => clearInterval(timer)
  // }, [step, timeLeft])

  // const formatTime = (seconds: number) => {
  //   const min = Math.floor(seconds / 60)
  //   const sec = seconds % 60
  //   return \`${min}:\${sec.toString().padStart(2, "0")}\`
  // }

  // const formatPhone = (raw: string) => {
  //   let cleanPhone = raw.trim()
  //   if (cleanPhone.startsWith("0") && cleanPhone.length === 11) {
  //     cleanPhone = "+234" + cleanPhone.slice(1)
  //   } else if (!cleanPhone.startsWith("+")) {
  //     cleanPhone = "+234" + cleanPhone
  //   }
  //   return cleanPhone
  // }

  // const handlePhoneSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault()
  //   setIsLoading(true)
  //   setErrorMsg(null)

  //   const cleanPhone = formatPhone(phone)

  //   try {
  //     const res = await fetch("/api/auth/send-otp", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ phone: cleanPhone })
  //     })

  //     const data = await res.json()

  //     if (!res.ok || !data.success) {
  //       setErrorMsg(data.error || "Failed to send OTP. Please try again.")
  //     } else {
  //       setFormattedPhone(cleanPhone)
  //       setStep("otp")
  //       setTimeLeft(300)
  //     }
  //   } catch (error) {
  //     setErrorMsg("Network error. Please check your connection.")
  //   }

  //   setIsLoading(false)
  // }

  // const handleVerifyOtpDirect = async (code: string) => {
  //   setIsLoading(true)
  //   setErrorMsg(null)

  //   try {
  //     const res = await fetch("/api/auth/verify-otp", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ phone: formattedPhone, code })
  //     })

  //     const data = await res.json()

  //     if (!res.ok || !data.success) {
  //       setErrorMsg(data.error || "Invalid code. Please try again.")
  //     } else {
  //       // OTP verified - sign in Supabase user
  //       const email = \`\${formattedPhone.replace(/[^0-9]/g, '')}@buildbridge.app\`
  //       const password = \`buildbridge-\${formattedPhone.replace(/[^0-9]/g, '')}\`
  //       const { error } = await supabase.auth.signInWithPassword({ email, password })
  //       if (error) {
  //         setErrorMsg(error.message)
  //       } else {
  //         router.push("/dashboard")
  //       }
  //     }
  //   } catch (error) {
  //     setErrorMsg("Network error. Please try again.")
  //   }
  //   setIsLoading(false)
  // }
*/
