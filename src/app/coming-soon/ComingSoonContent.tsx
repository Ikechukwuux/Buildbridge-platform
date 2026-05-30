"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Twitter, Instagram, Facebook, ArrowRight, CheckCircle2, Loader2, ShieldCheck, Hammer } from "lucide-react"
import { Logo } from "@/components/ui/Logo"
import { joinWaitlist } from "@/app/actions/waitlist"

type UserType = "artisan" | "donor"
type Phase = "idle" | "submitting" | "done" | "error"

const SOCIAL = [
  { icon: Twitter, label: "Twitter", href: "https://twitter.com" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
  { icon: Facebook, label: "Facebook", href: "https://facebook.com" },
]

export function ComingSoonContent() {
  const [email, setEmail] = React.useState("")
  const [userType, setUserType] = React.useState<UserType>("donor")
  const [phase, setPhase] = React.useState<Phase>("idle")
  const [errorMsg, setErrorMsg] = React.useState("")
  const [alreadyJoined, setAlreadyJoined] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setPhase("submitting")
    setErrorMsg("")
    const res = await joinWaitlist(email.trim(), userType)
    if (!res.success) {
      setPhase("error")
      setErrorMsg(res.error || "Something went wrong. Try again.")
      return
    }
    setAlreadyJoined(!!res.alreadyJoined)
    setPhase("done")
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-tertiary/10 blur-[120px] pointer-events-none" />

      {/* Nav */}
      <header className="relative z-10 flex items-center justify-between px-6 sm:px-10 pt-8">
        <Logo variant="white" />
        <a
          href="/browse"
          className="text-xs font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors"
        >
          Browse &rarr;
        </a>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 px-6 sm:px-10 py-20 max-w-7xl mx-auto w-full">

        {/* Left: Copy + Form */}
        <div className="flex flex-col gap-8 flex-1 max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white/70 text-xs font-black uppercase tracking-widest w-fit">
              <ShieldCheck className="h-3.5 w-3.5" />
              Launching soon
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.05]">
              Donate to the{" "}
              <span className="text-primary italic underline decoration-yellow-400 decoration-4 underline-offset-8">
                hands
              </span>{" "}
              that build Nigeria.
            </h1>

            <p className="text-base md:text-lg text-white/60 font-medium leading-relaxed max-w-lg">
              BuildBridge connects verified Nigerian artisans — tailors, carpenters, bakers, welders — with people who want to fund their equipment needs directly. Every pledge is held securely and released only after proof is uploaded.
            </p>
          </motion.div>

          {/* User type toggle */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-col gap-4"
          >
            <p className="text-xs font-black uppercase tracking-widest text-white/40">I am joining as a…</p>
            <div className="flex gap-3">
              {([
                { value: "donor", label: "Donor / Supporter", icon: ArrowRight },
                { value: "artisan", label: "Artisan / Tradesperson", icon: Hammer },
              ] as const).map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setUserType(opt.value)}
                  className={`flex-1 flex items-center gap-2 h-12 px-4 rounded-full border-2 text-sm font-black transition-all ${
                    userType === opt.value
                      ? "border-primary bg-primary/20 text-white"
                      : "border-white/15 text-white/50 hover:border-white/30 hover:text-white/80"
                  }`}
                >
                  <opt.icon className="h-4 w-4" />
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Email capture */}
          <AnimatePresence mode="wait">
            {phase === "done" ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col gap-3 p-6 rounded-3xl bg-white/5 border border-white/10"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0" />
                  <p className="text-lg font-black">
                    {alreadyJoined ? "You're already on the list!" : "You're on the list!"}
                  </p>
                </div>
                <p className="text-sm text-white/60 font-medium leading-relaxed">
                  {alreadyJoined
                    ? "We already have your spot reserved. We'll be in touch when we launch."
                    : `We'll email ${email} when BuildBridge opens. Follow us on social to hear the latest.`}
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                onSubmit={handleSubmit}
                className="flex flex-col gap-3"
              >
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="flex-1 h-14 bg-white/10 border border-white/20 rounded-full px-6 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm font-medium"
                  />
                  <button
                    type="submit"
                    disabled={phase === "submitting" || !email.trim()}
                    className="h-14 px-6 rounded-full bg-primary text-on-primary font-black text-sm uppercase tracking-widest hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all shadow-lg shadow-primary/30 flex items-center gap-2 whitespace-nowrap"
                  >
                    {phase === "submitting" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>Reserve my spot <ArrowRight className="h-4 w-4" /></>
                    )}
                  </button>
                </div>
                {phase === "error" && errorMsg && (
                  <p className="text-sm font-bold text-red-400 pl-2">{errorMsg}</p>
                )}
                <p className="text-[10px] text-white/30 font-medium pl-2">
                  No spam. One email when we launch.
                </p>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Social */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-4"
          >
            <p className="text-xs font-black uppercase tracking-widest text-white/30">Follow us</p>
            {SOCIAL.map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white hover:border-white/30 transition-all"
              >
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </motion.div>
        </div>

        {/* Right: Artisan photo */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-shrink-0 w-full max-w-sm lg:max-w-md"
        >
          <div className="relative">
            <div className="aspect-[3/4] rounded-[3rem] overflow-hidden border-4 border-white/10 shadow-2xl">
              <img
                src="/images/hero/tailor.png"
                alt="Verified Nigerian artisan"
                className="w-full h-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Floating stat */}
            <div className="absolute -bottom-5 -left-5 bg-white text-on-surface rounded-3xl p-5 shadow-2xl flex flex-col gap-1">
              <p className="text-3xl font-black text-primary">6+</p>
              <p className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant/70">
                Trades covered
              </p>
            </div>

            {/* Verified pill */}
            <div className="absolute top-5 right-5 flex items-center gap-2 bg-emerald-500 text-white rounded-full px-4 py-2 shadow-xl">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-xs font-black uppercase tracking-widest">Verified</span>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Bottom fine print */}
      <footer className="relative z-10 text-center px-6 pb-8">
        <p className="text-[10px] uppercase tracking-widest font-bold text-white/20">
          &copy; {new Date().getFullYear()} BuildBridge Impact Platform &mdash;{" "}
          <a href="/privacy" className="hover:text-white/50 transition-colors">Privacy</a>{" "}
          &middot;{" "}
          <a href="/terms" className="hover:text-white/50 transition-colors">Terms</a>
        </p>
      </footer>
    </div>
  )
}
