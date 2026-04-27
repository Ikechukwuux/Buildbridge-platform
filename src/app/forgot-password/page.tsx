"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import Link from "next/link"
import { Sparkles, ArrowLeft, Mail, CheckCircle2 } from "lucide-react"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        setErrorMsg(error.message || "Failed to send reset email.")
      } else {
        setSuccess(true)
      }
    } catch (error) {
      setErrorMsg("An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-lg p-10 shadow-2xl rounded-[2.5rem] border-primary/10 overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles className="w-24 h-24 text-primary" />
        </div>

        <div className="flex flex-col gap-8 relative z-10 text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-black text-on-surface tracking-tight">Check your email</h1>
            <p className="text-on-surface-variant font-medium leading-relaxed">
              We've sent a password reset link to <span className="font-bold text-primary">{email}</span>.
              Click the link in the email to create a new password.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <Link 
              href="/login" 
              className="h-14 rounded-full border-2 border-outline-variant text-on-surface font-black flex items-center justify-center gap-2 hover:bg-surface-variant transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Login
            </Link>
          </div>

          <p className="text-sm text-on-surface-variant">
            Didn't receive the email?{" "}
            <button 
              onClick={() => setSuccess(false)} 
              className="text-primary font-bold hover:underline"
            >
              Try again
            </button>
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-lg p-10 shadow-2xl rounded-[2.5rem] border-primary/10 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <Sparkles className="w-24 h-24 text-primary" />
      </div>

      <div className="flex flex-col gap-8 relative z-10">
        <div className="flex flex-col gap-3 text-center">
          <h1 className="text-4xl font-black text-on-surface tracking-tight">Reset <span className="text-primary italic">Password.</span></h1>
          <p className="text-on-surface-variant font-medium leading-relaxed">
            Enter your email address and we'll send you a link to create a new password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-6">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errorMsg) setErrorMsg(null)
              }}
              placeholder="e.g. hello@buildbridge.app"
              autoComplete="email"
              className="h-16 rounded-3xl text-lg font-bold border-2 focus:border-primary transition-all"
              required
            />
          </div>

          {errorMsg && (
            <p className="text-sm font-bold text-error text-center bg-error/5 py-2 rounded-xl border border-error/10">
              {errorMsg}
            </p>
          )}

          <Button
            type="submit"
            isLoading={isLoading}
            className="h-16 rounded-full text-lg font-black shadow-xl shadow-primary/20"
            disabled={!email}
          >
            Send Reset Link
          </Button>
        </form>

        <div className="text-center text-sm font-bold text-on-surface-variant/60 uppercase tracking-widest mt-2 px-2">
          Remember your password?{" "}
          <Link href="/login" className="text-primary font-black hover:underline ml-1">
            Sign in
          </Link>
        </div>
      </div>
    </Card>
  )
}