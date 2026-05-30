"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

const TIMEOUT_MS = 30 * 60 * 1000 // 30 minutes
const WARN_BEFORE_MS = 2 * 60 * 1000 // warn 2 min before expiry

const EVENTS = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"]

export function SessionTimeoutGuard() {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = React.useMemo(() => createClient(), [])
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const warnTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const [showWarning, setShowWarning] = React.useState(false)

  const signOut = React.useCallback(async () => {
    setShowWarning(false)
    await supabase.auth.signOut()
    router.replace(`/login?reason=session_expired&redirectTo=${encodeURIComponent(pathname)}`)
  }, [router, supabase, pathname])

  const resetTimer = React.useCallback(() => {
    setShowWarning(false)
    if (timerRef.current) clearTimeout(timerRef.current)
    if (warnTimerRef.current) clearTimeout(warnTimerRef.current)

    warnTimerRef.current = setTimeout(() => {
      setShowWarning(true)
    }, TIMEOUT_MS - WARN_BEFORE_MS)

    timerRef.current = setTimeout(signOut, TIMEOUT_MS)
  }, [signOut])

  React.useEffect(() => {
    resetTimer()
    EVENTS.forEach(e => window.addEventListener(e, resetTimer, { passive: true }))
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (warnTimerRef.current) clearTimeout(warnTimerRef.current)
      EVENTS.forEach(e => window.removeEventListener(e, resetTimer))
    }
  }, [resetTimer])

  if (!showWarning) return null

  return (
    <div
      role="dialog"
      aria-live="assertive"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] w-full max-w-sm px-4"
    >
      <div className="rounded-3xl bg-on-surface text-surface shadow-2xl p-5 flex flex-col gap-3">
        <p className="text-sm font-black">Session expiring soon</p>
        <p className="text-xs text-white/70 font-medium leading-relaxed">
          You'll be signed out in 2 minutes due to inactivity. Move your mouse or type to stay signed in.
        </p>
        <div className="flex gap-2 mt-1">
          <button
            onClick={resetTimer}
            className="flex-1 h-10 rounded-full bg-yellow-400 text-[#121212] font-black text-xs uppercase tracking-widest hover:bg-yellow-300 active:scale-[0.98] transition"
          >
            Stay signed in
          </button>
          <button
            onClick={signOut}
            className="flex-1 h-10 rounded-full border border-white/20 text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 active:scale-[0.98] transition"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}
