import { Metadata } from "next"
import { ChevronLeft, ArrowLeft, ShieldCheck, Zap, Star } from "lucide-react"
import Link from "next/link"
import { PledgeFlow } from "@/components/pledge/PledgeFlow"

interface PaymentPageProps {
  params: { needId: string }
}

// Mock need data for demo - same as in need detail page
const MOCK_NEEDS: Record<string, any> = {
  "demo-need-001": {
    id: "demo-need-001",
    item_name: "Industrial Overlock Machine",
    item_cost: 35000000,
    funded_amount: 21500000,
    pledge_count: 14,
    status: "active",
    photo_url: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&q=80&w=800",
    story: "I've been a tailor in Surulere for 8 years, specializing in school uniforms and traditional attire. My current machine breaks down every other week, costing me clients and income.\n\nWith an industrial overlock machine, I can take on bulk uniform contracts for 3 local schools and hire two apprentices from my community. This is not just a machine — it's the foundation of a workshop.",
    impact_statement: "This machine will allow me to hire 2 apprentices and fulfill bulk contracts for 3 local schools, growing my output by 300%.",
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    created_at: new Date().toISOString(),
    profile: {
      name: "Amina S.",
      location_lga: "Surulere",
      location_state: "Lagos",
      trade_category: "tailor",
      badge_level: "level_3_established",
      vouch_count: 8,
      photo_url: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=400",
    },
  },
  "demo-browse-001": {
    id: "demo-browse-001",
    item_name: "Industrial Overlock Machine",
    item_cost: 35000000,
    funded_amount: 21500000,
    funding_percentage: 61,
    pledge_count: 14,
    status: "active",
    photo_url: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&q=80&w=800",
    story: "I need an overlock machine to take on more uniform contracts.",
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    profile: {
      name: "Amina S.",
      location_lga: "Surulere",
      location_state: "Lagos",
      trade_category: "tailor",
      badge_level: "level_3_established",
      vouch_count: 8,
      photo_url: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=400",
    },
  },
}

export async function generateMetadata({ params }: PaymentPageProps): Promise<Metadata> {
  const need = MOCK_NEEDS[params.needId] || MOCK_NEEDS["demo-need-001"]
  return {
    title: `Back ${need.profile.name} - ${need.item_name} | BuildBridge`,
    description: `Support ${need.profile.name}'s need for a ${need.item_name}.`,
  }
}

const TRUST_PILLARS = [
  {
    icon: ShieldCheck,
    label: "Secure Escrow",
    desc: "Funds are held securely and only released when the tradesperson provides proof of purchase.",
  },
  {
    icon: Zap,
    label: "Zero Fees",
    desc: "We charge 0% fees to tradespeople. 100% of your pledge goes to them.",
  },
  {
    icon: Star,
    label: "Verified Impact",
    desc: "Every funded need requires proof of use, so you see exactly what your backing made possible.",
  },
]

export default async function PaymentPage({ params }: PaymentPageProps) {
  const need = MOCK_NEEDS[params.needId] || MOCK_NEEDS["demo-need-001"]
  const fundedPct = Math.round((need.funded_amount / need.item_cost) * 100)

  const formatNGN = (kobo: number) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(kobo / 100)

  return (
    <main className="min-h-screen bg-background pt-24 pb-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* Navigation breadcrumb */}
        <div className="flex items-center justify-between mb-10">
          <Link
            href={`/needs/${need.id}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors group"
          >
            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Need
          </Link>
          <Link
            href="/browse"
            className="inline-flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors"
          >
            Browse Needs
            <ArrowLeft className="h-4 w-4 rotate-180" />
          </Link>
        </div>

        {/* Page header */}
        <div className="mb-12 max-w-2xl">
          <p className="text-[11px] font-black uppercase tracking-[0.25em] text-primary mb-3">
            Backing a Tradesperson
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-on-surface tracking-tight leading-[1.1] mb-4">
            Back{" "}
            <span className="text-primary italic">{need.profile.name}</span>
          </h1>
          <p className="text-lg text-on-surface-variant font-medium leading-relaxed">
            Support{" "}
            <span className="font-bold text-on-surface">{need.profile.name}</span>
            's need for a{" "}
            <span className="font-bold text-on-surface">{need.item_name}</span>.
          </p>
        </div>

        {/* Two-column layout: artisan context + pledge flow */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* LEFT: Artisan context card */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Cover photo */}
            <div className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden bg-surface-variant/30 shadow-xl shadow-black/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={need.photo_url}
                alt={need.item_name}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              {/* Need name overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-white font-black text-lg leading-tight drop-shadow-sm">{need.item_name}</p>
              </div>
            </div>

            {/* Artisan identity card */}
            <div className="p-6 bg-surface rounded-[2rem] border border-outline-variant/40 shadow-sm flex items-center gap-4">
              <div className="relative shrink-0">
                <div className="h-14 w-14 rounded-2xl overflow-hidden bg-surface-variant">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={need.profile.photo_url}
                    alt={need.profile.name}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-500 border-2 border-white flex items-center justify-center shadow">
                  <ShieldCheck className="h-2.5 w-2.5 text-white" />
                </div>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-black text-on-surface text-base">{need.profile.name}</span>
                <span className="text-xs font-bold text-on-surface-variant capitalize">
                  {need.profile.trade_category?.replace("_", " ")} · {need.profile.location_lga}, {need.profile.location_state}
                </span>
              </div>
            </div>

            {/* Progress snapshot */}
            <div className="p-6 bg-surface rounded-[2rem] border border-outline-variant/40 shadow-sm flex flex-col gap-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-60">
                Funding Progress
              </p>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-black text-on-surface">{fundedPct}%</span>
                <span className="text-sm font-bold text-on-surface-variant">
                  {formatNGN(need.funded_amount)} of {formatNGN(need.item_cost)}
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-surface-variant/50 overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${Math.min(100, fundedPct)}%` }}
                />
              </div>
              <p className="text-xs font-bold text-on-surface-variant">
                {need.pledge_count} backers · {Math.ceil((new Date(need.deadline).getTime() - Date.now()) / 86400000)} days left
              </p>
            </div>
          </div>

          {/* RIGHT: Pledge flow */}
          <div className="lg:col-span-3">
            <div className="bg-surface rounded-[2.5rem] border border-outline-variant/30 shadow-[0_20px_60px_rgba(0,0,0,0.07)] overflow-hidden">
              <PledgeFlow
                needId={need.id}
                needName={need.item_name}
                tradespersonName={need.profile.name}
                goalAmount={need.item_cost}
                alwaysShow={true}
              />
            </div>
          </div>
        </div>

        {/* Trust pillars */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {TRUST_PILLARS.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="flex flex-col gap-3 p-7 bg-surface rounded-[2rem] border border-outline-variant/30 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary">{label}</p>
              <p className="text-sm font-medium text-on-surface-variant leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

      </div>
    </main>
  )
}