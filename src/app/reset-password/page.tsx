"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import Link from "next/link"
import { Sparkles, ArrowLeft, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [tokenError, setTokenError] = useState(false)

  const accessToken = searchParams?.get("access_token")
  const refreshToken = searchParams?.get("refresh_token")
  const type = searchParams?.get("type")

  useEffect(() => {
    if (!accessToken && !refreshToken) {
      setTokenError(true)
    } else if (type !== "recovery") {
      setTokenError(true)
    }
  }, [accessToken, refreshToken, type])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg(null)

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.")
      setIsLoading(false)
      return
    }

    try {
      if (accessToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || "",
        })

        if (error) {
          setErrorMsg(error.message || "Invalid or expired reset link.")
          setIsLoading(false)
          return
        }
      }

      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) {
        setErrorMsg(error.message || "Failed to update password.")
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      }
    } catch (error) {
      setErrorMsg("An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  if (tokenError) {
    return (
      <Card className="w-full max-w-lg p-10 shadow-2xl rounded-[2.5rem] border-primary/10 overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles className="w-24 h-24 text-primary" />
        </div>

        <div className="flex flex-col gap-8 relative z-10 text-center">
          <div className="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center mx-auto">
            <AlertCircle className="w-10 h-10 text-error" />
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-black text-on-surface tracking-tight">Invalid Link</h1>
            <p className="text-on-surface-variant font-medium leading-relaxed">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
          </div>

          <Link 
            href="/forgot-password" 
            className="h-14 rounded-full bg-primary text-white font-black flex items-center justify-center gap-2 shadow-xl shadow-primary/20"
          >
            Request New Link
          </Link>

          <Link 
            href="/login" 
            className="h-14 rounded-full border-2 border-outline-variant text-on-surface font-black flex items-center justify-center gap-2 hover:bg-surface-variant transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Login
          </Link>
        </div>
      </Card>
    )
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
            <h1 className="text-3xl font-black text-on-surface tracking-tight">Password Reset!</h1>
            <p className="text-on-surface-variant font-medium leading-relaxed">
              Your password has been updated successfully. Redirecting to login...
            </p>
          </div>
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
          <h1 className="text-4xl font-black text-on-surface tracking-tight">New <span className="text-primary italic">Password.</span></h1>
          <p className="text-on-surface-variant font-medium leading-relaxed">
            Enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-6">
            <div className="relative">
              <Input
                label="New Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (errorMsg) setErrorMsg(null)
                }}
                placeholder="Enter new password"
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

            <Input
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                if (errorMsg) setErrorMsg(null)
              }}
              placeholder="Confirm new password"
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
            disabled={!password || !confirmPassword}
          >
            Reset Password
          </Button>
        </form>

        <div className="text-center text-sm font-bold text-on-surface-variant/60 uppercase tracking-widest mt-2 px-2">
          <Link href="/login" className="text-primary font-black hover:underline ml-1">
            Back to Login
          </Link>
        </div>
      </div>
    </Card>
  )
}