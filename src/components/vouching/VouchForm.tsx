"use client"

import * as React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/Textarea"
import { useAuth } from "@/hooks/useAuth"
import { submitVouchAction } from "@/app/actions/vouch"
import { CheckCircle2 } from "lucide-react"

interface VouchFormProps {
  recipientProfileId: string;
  recipientName: string;
}

export function VouchForm({ recipientProfileId, recipientName }: VouchFormProps) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  const [statement, setStatement] = useState("")
  const [voucherName, setVoucherName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = new FormData()
      data.append("recipient_profile_id", recipientProfileId)
      data.append("statement", statement)
      if (!isAuthenticated) {
        data.append("voucher_name", voucherName)
      }

      const result = await submitVouchAction(data)

      if (result.success) {
        setSubmitted(true)
      } else {
        setError(result.error || "Failed to submit vouch.")
      }
    } catch (err: any) {
      setError("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <motion.div
        key="success"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-12 gap-8 text-center w-full max-w-xl mx-auto px-4"
      >
        <div className="h-32 w-32 rounded-full bg-green-100 text-green-600 flex items-center justify-center shadow-2xl">
          <CheckCircle2 className="h-20 w-20" />
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-3xl font-black text-on-surface">Thank You!</h3>
          <p className="text-lg text-on-surface-variant max-w-sm mx-auto">
            Your vouch has been recorded. You&apos;ve helped {recipientName} build their reputation.
          </p>
        </div>
        <Button onClick={() => router.push(`/`) } className="w-full text-lg font-black h-16 rounded-2xl shadow-lg">
          Return to Home
        </Button>
      </motion.div>
    )
  }

  return (
    <div className="w-full max-w-xl mx-auto px-4">
      <div className="flex flex-col gap-8">

        <div className="text-center">
          <h1 className="text-3xl font-black text-on-surface mb-2">Vouch for {recipientName}</h1>
          <p className="text-lg text-on-surface-variant">
            Your vouch helps {recipientName} build trust in the community.
          </p>
        </div>

        {/* Anonymous user: name input */}
        {!isAuthenticated && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-black text-on-surface px-1">
              Your Name
            </label>
            <input
              type="text"
              value={voucherName}
              onChange={(e) => setVoucherName(e.target.value)}
              placeholder="What should we call you?"
              className="w-full h-14 px-4 rounded-2xl border-2 border-outline-variant bg-surface text-on-surface text-base focus:border-primary focus:outline-none transition-colors"
              disabled={loading}
            />
          </div>
        )}

        {/* Statement */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-black text-on-surface px-1">
            Why do you trust {recipientName}&apos;s work?
          </label>

          <div className="flex flex-wrap gap-2">
            {[
              "I have hired them to...",
              "They always deliver...",
              "I can vouch for their...",
              "They are skilled at..."
            ].map((starter) => (
              <button
                key={starter}
                type="button"
                onClick={() => setStatement(starter)}
                className="text-xs bg-surface border border-outline-variant px-3 py-1.5 rounded-full hover:bg-primary/5 hover:border-primary transition-colors text-on-surface-variant"
                disabled={loading}
              >
                + {starter}
              </button>
            ))}
          </div>

          <Textarea
            className="min-h-[160px] text-base"
            value={statement}
            onChange={(e) => setStatement(e.target.value)}
            placeholder="Tell us about their character and work ethic..."
            disabled={loading}
          />

          <div className="flex justify-between items-center text-xs">
            <span className={statement.length < 20 ? "text-red-500" : "text-green-600"}>
              {statement.length < 20 ? "At least 20 characters" : "Looks good!"}
            </span>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
          <p className="text-sm text-amber-800 text-center">
            Vouching does <strong>not</strong> make you financially responsible.
            Your reputation is your commitment.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl font-medium text-center text-sm border border-red-200">
            {error}
          </div>
        )}

        <Button
          onClick={handleSubmit}
          isLoading={loading}
          disabled={statement.length < 20 || (!isAuthenticated && !voucherName.trim())}
          className="w-full h-16 rounded-2xl text-base font-black"
        >
          Submit Vouch
        </Button>

      </div>
    </div>
  )
}
