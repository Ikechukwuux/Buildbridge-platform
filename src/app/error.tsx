"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { AlertTriangle, RefreshCw, ArrowRight, Hammer } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    console.error("[GlobalError]", error)
  }, [error])

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-24">
      <div className="max-w-xl mx-auto text-center flex flex-col items-center gap-8">
        <div className="relative">
          <div className="w-32 h-32 rounded-[2.5rem] bg-amber-500/10 flex items-center justify-center">
            <AlertTriangle className="h-16 w-16 text-amber-600" />
          </div>
          <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-on-surface text-surface text-xs font-black tracking-widest uppercase shadow-lg">
            500
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-4xl md:text-5xl font-black text-on-surface tracking-tight">
            Something went wrong
          </h1>
          <p className="text-base md:text-lg font-medium text-on-surface-variant leading-relaxed max-w-md mx-auto">
            We hit an unexpected error. The team has been notified — try refreshing in a moment.
          </p>
          {error?.digest && (
            <p className="text-[10px] uppercase tracking-widest font-black text-on-surface-variant/40 pt-1">
              Reference: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
          <Button
            onClick={() => reset()}
            className="flex-1 h-12 rounded-full font-black gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </Button>
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full h-12 rounded-full font-black gap-2">
              Go to homepage
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="pt-6 flex items-center gap-2 text-sm text-on-surface-variant font-medium">
          <Hammer className="h-4 w-4 text-primary" />
          Need help?{" "}
          <Link href="/contact" className="font-black text-primary hover:underline">
            Get in touch
          </Link>
        </div>
      </div>
    </main>
  )
}
