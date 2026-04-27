"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, X, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { createClient } from "@/lib/supabase/client"
import { NIGERIA_LOCATIONS } from "@/lib/data/nigeria"
import { cn } from "@/lib/utils"

function isProfileIncomplete(profile: any): boolean {
  if (!profile) return true
  return !profile.trade_category || !profile.location_state || !profile.location_lga
}

export function ProfileCompletionBanner({
  profile,
  showOnMount = false,
}: {
  profile: any
  showOnMount?: boolean
}) {
  const supabase = createClient()
  const [visible, setVisible] = useState(showOnMount || isProfileIncomplete(profile))
  const [expanded, setExpanded] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [tradeCategory, setTradeCategory] = useState(profile?.trade_category || "")
  const [state, setState] = useState(profile?.location_state || "")
  const [lga, setLga] = useState(profile?.location_lga || "")

  const currentLGAs = NIGERIA_LOCATIONS.find(
    s => s.state === state || s.id === state
  )?.lgas || []

  const TRADE_CATEGORIES = [
    { id: "tailor", label: "Tailor" },
    { id: "carpenter", label: "Carpenter" },
    { id: "welder", label: "Welder" },
    { id: "mechanic", label: "Mechanic" },
    { id: "electrician", label: "Electrician" },
    { id: "baker", label: "Baker" },
    { id: "cobbler", label: "Cobbler" },
    { id: "plumber", label: "Plumber" },
    { id: "hair_stylist", label: "Hair Stylist" },
    { id: "food_processor", label: "Food Processor" },
    { id: "market_trader", label: "Market Trader" },
    { id: "blacksmith", label: "Blacksmith" },
    { id: "other", label: "Other" },
  ]

  const handleSave = async () => {
    if (!tradeCategory || !state || !lga) {
      setError("Please fill in all fields")
      return
    }

    setSaving(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const stateId = state.toLowerCase().replace(/\s+/g, "_")

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          trade_category: tradeCategory,
          location_state: stateId,
          location_lga: lga,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)

      if (updateError) throw updateError

      setSaved(true)
      setTimeout(() => {
        setVisible(false)
      }, 2000)
    } catch (err: any) {
      setError(err.message || "Failed to save")
    } finally {
      setSaving(false)
    }
  }

  if (!visible) return null

  if (saved) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-2xl bg-success/10 border border-success/30 flex items-center gap-3"
      >
        <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
        <p className="text-sm font-bold text-success">Profile completed! Your tradesperson profile is now set up.</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-2xl bg-warning/10 border border-warning/30"
    >
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 rounded-xl bg-warning/20 flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="h-5 w-5 text-warning" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-black text-on-surface">
            Finish setting up your profile
          </h3>
          <p className="text-xs text-on-surface-variant mt-1">
            Add your trade, state, and LGA to build trust with backers and get discovered.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {!expanded && (
            <button
              onClick={() => setExpanded(true)}
              className="h-10 px-5 rounded-full bg-primary text-on-primary text-xs font-black hover:shadow-lg transition-all"
            >
              Complete Profile
            </button>
          )}
          <button
            onClick={() => setVisible(false)}
            className="p-2 rounded-full hover:bg-surface-variant/30 transition-colors"
          >
            <X className="h-4 w-4 text-on-surface-variant" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-5 pt-5 border-t border-outline-variant/20 flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 ml-1">
                    Trade Category
                  </label>
                  <select
                    value={tradeCategory}
                    onChange={(e) => setTradeCategory(e.target.value)}
                    className="w-full h-11 rounded-xl border-2 border-outline-variant focus:border-primary px-3 text-sm font-bold bg-white outline-none cursor-pointer"
                  >
                    <option value="">Select trade</option>
                    {TRADE_CATEGORIES.map((t) => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 ml-1">
                    State
                  </label>
                  <select
                    value={state}
                    onChange={(e) => { setState(e.target.value); setLga("") }}
                    className="w-full h-11 rounded-xl border-2 border-outline-variant focus:border-primary px-3 text-sm font-bold bg-white outline-none cursor-pointer"
                  >
                    <option value="">Select state</option>
                    {NIGERIA_LOCATIONS.map((s) => (
                      <option key={s.id} value={s.state}>{s.state}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 ml-1">
                    LGA
                  </label>
                  <select
                    value={lga}
                    onChange={(e) => setLga(e.target.value)}
                    disabled={!state}
                    className="w-full h-11 rounded-xl border-2 border-outline-variant focus:border-primary px-3 text-sm font-bold bg-white outline-none cursor-pointer disabled:opacity-40"
                  >
                    <option value="">Select LGA</option>
                    {currentLGAs.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>

              {error && (
                <p className="text-xs font-bold text-error bg-error/5 p-3 rounded-xl border border-error/20">
                  {error}
                </p>
              )}

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setExpanded(false)}
                  className="h-10 px-5 rounded-full text-xs font-bold text-on-surface-variant hover:bg-surface-variant/30 transition-colors"
                >
                  Cancel
                </button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="h-10 px-6 rounded-full text-xs font-black"
                >
                  {saving ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    "Save & Continue"
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
