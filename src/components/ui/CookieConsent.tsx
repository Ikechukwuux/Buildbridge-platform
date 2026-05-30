"use client"

import * as React from "react"
import Link from "next/link"
import { Cookie } from "lucide-react"

const STORAGE_KEY = "bb-cookie-consent"
type ConsentValue = "granted" | "denied"

export function hasCookieConsent(): boolean {
  if (typeof window === "undefined") return false
  return window.localStorage.getItem(STORAGE_KEY) === "granted"
}

export function CookieConsent() {
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored !== "granted" && stored !== "denied") {
      setVisible(true)
    }
  }, [])

  const setConsent = (value: ConsentValue) => {
    window.localStorage.setItem(STORAGE_KEY, value)
    window.dispatchEvent(new CustomEvent("bb-cookie-consent-changed", { detail: value }))
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-3 bottom-3 z-[60] sm:inset-x-auto sm:left-6 sm:right-6 sm:bottom-6 md:left-8 md:right-8 lg:right-8 lg:left-auto lg:max-w-md"
    >
      <div className="rounded-3xl bg-on-surface text-surface shadow-2xl border border-white/10 p-5 sm:p-6 flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-yellow-400/15 flex items-center justify-center text-yellow-400 shrink-0">
            <Cookie className="h-5 w-5" />
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-black tracking-tight">Cookies on BuildBridge</p>
            <p className="text-xs text-white/70 font-medium leading-relaxed">
              We use a small number of cookies to keep you signed in and improve the platform. Analytics and tracking cookies only load if you accept.{" "}
              <Link href="/privacy" className="underline font-bold hover:text-yellow-300">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setConsent("denied")}
            className="flex-1 h-11 rounded-full border border-white/20 text-white text-xs font-black uppercase tracking-widest hover:bg-white/5 active:scale-[0.98] transition"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => setConsent("granted")}
            className="flex-1 h-11 rounded-full bg-yellow-400 text-[#121212] text-xs font-black uppercase tracking-widest hover:bg-yellow-300 active:scale-[0.98] transition shadow-lg"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
