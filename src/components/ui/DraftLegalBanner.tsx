import * as React from "react"
import { AlertTriangle } from "lucide-react"

export function DraftLegalBanner() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-2xl border-2 border-amber-400 bg-amber-50 p-5 md:p-6 flex gap-4 items-start"
    >
      <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-700 shrink-0">
        <AlertTriangle size={20} />
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-xs font-black uppercase tracking-widest text-amber-700">
          Draft — Final Legal Review Pending
        </p>
        <p className="text-sm font-medium leading-relaxed text-amber-900">
          This document is a working summary. The final NDPA-compliant text is being prepared with our legal counsel and will replace this version before public launch. Do not rely on the current wording for binding commitments.
        </p>
      </div>
    </div>
  )
}
