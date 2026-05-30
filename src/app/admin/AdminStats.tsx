import {
  Users,
  TrendingUp,
  CheckCircle2,
  Heart,
  ShieldCheck,
  Clock,
  Camera,
} from "lucide-react"

type Stats = {
  profilesCount: number
  needsActive: number
  needsFunded: number
  needsCompleted: number
  needsPendingReview: number
  pledgesCount: number
  totalPledgedKobo: number
  totalToArtisansKobo: number
  verificationsPending: number
}

function formatNGN(kobo: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format((kobo || 0) / 100)
}

function formatCount(n: number) {
  return new Intl.NumberFormat("en-US").format(n)
}

export function AdminStats({ stats, pendingProofs }: { stats: Stats; pendingProofs: number }) {
  const tiles: { label: string; value: string; icon: any; tint: string }[] = [
    {
      label: "Total artisans",
      value: formatCount(stats.profilesCount),
      icon: Users,
      tint: "text-primary bg-primary/10",
    },
    {
      label: "Active needs",
      value: formatCount(stats.needsActive),
      icon: TrendingUp,
      tint: "text-blue-600 bg-blue-500/10",
    },
    {
      label: "Completed",
      value: formatCount(stats.needsCompleted),
      icon: CheckCircle2,
      tint: "text-emerald-600 bg-emerald-500/10",
    },
    {
      label: "Total pledges",
      value: formatCount(stats.pledgesCount),
      icon: Heart,
      tint: "text-rose-500 bg-rose-500/10",
    },
    {
      label: "Pledged (gross)",
      value: formatNGN(stats.totalPledgedKobo),
      icon: TrendingUp,
      tint: "text-amber-600 bg-amber-500/10",
    },
    {
      label: "To artisans (net)",
      value: formatNGN(stats.totalToArtisansKobo),
      icon: TrendingUp,
      tint: "text-emerald-600 bg-emerald-500/10",
    },
    {
      label: "Pending review",
      value: formatCount(stats.needsPendingReview),
      icon: Clock,
      tint: "text-amber-600 bg-amber-500/10",
    },
    {
      label: "Verifications queue",
      value: formatCount(stats.verificationsPending),
      icon: ShieldCheck,
      tint: "text-indigo-600 bg-indigo-500/10",
    },
    {
      label: "Proofs awaiting review",
      value: formatCount(pendingProofs),
      icon: Camera,
      tint: "text-rose-500 bg-rose-500/10",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {tiles.map(t => {
        const Icon = t.icon
        return (
          <div
            key={t.label}
            className="p-5 rounded-[1.5rem] bg-white border border-outline-variant/30 flex flex-col gap-2 shadow-sm"
          >
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center ${t.tint}`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <span className="text-2xl font-black text-on-surface tracking-tight truncate">
              {t.value}
            </span>
            <span className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant/60">
              {t.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
