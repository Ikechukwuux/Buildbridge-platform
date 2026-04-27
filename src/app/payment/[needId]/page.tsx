import { Metadata } from "next"
import { ChevronLeft, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { PledgeFlow } from "@/components/pledge/PledgeFlow"

interface PaymentPageProps {
  params: Promise<{ needId: string }>
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
  const { needId } = await params
  const need = MOCK_NEEDS[needId] || MOCK_NEEDS["demo-need-001"]
  return {
    title: `Back ${need.profile.name} - ${need.item_name} | BuildBridge`,
    description: `Support ${need.profile.name}'s need for a ${need.item_name}.`,
  }
}


export default async function PaymentPage({ params }: PaymentPageProps) {
  const { needId } = await params
  const need = MOCK_NEEDS[needId] || MOCK_NEEDS["demo-need-001"]
  const fundedPct = Math.round((need.funded_amount / need.item_cost) * 100)

  const formatNGN = (kobo: number) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(kobo / 100)

  return (
    <main className="min-h-screen bg-background pt-24 pb-24">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">

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

        {/* Single-column layout: artisan context + pledge flow */}
        <div className="flex flex-col gap-8">


          {/* Pledge flow */}
          <div className="w-full">
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


      </div>
    </main>
  )
}