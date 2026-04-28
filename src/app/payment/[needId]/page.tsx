import { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { ChevronLeft, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { PledgeFlow } from "@/components/pledge/PledgeFlow"
import { DEMO_NEEDS } from "@/lib/data/demo-needs"

interface PaymentPageProps {
  params: Promise<{ needId: string }>
}

export async function generateMetadata({ params }: PaymentPageProps): Promise<Metadata> {
  const { needId } = await params
  const need = await getNeed(needId)
  return {
    title: `Back ${need.profile.name} - ${need.item_name} | BuildBridge`,
    description: `Support ${need.profile.name}'s need for a ${need.item_name}.`,
  }
}

async function getNeed(needId: string) {
  // Try Supabase first
  try {
    const supabase = await createClient()
    if (supabase) {
      const { data: dbNeed } = await supabase
        .from('needs')
        .select(`*, profile:profiles(full_name, location_lga, location_state, trade_category, badge_level, vouch_count, photo_url)`)
        .eq('id', needId)
        .single()

      if (dbNeed) {
        return {
          id: dbNeed.id,
          item_name: dbNeed.item_name,
          item_cost: dbNeed.item_cost,
          funded_amount: dbNeed.funded_amount || 0,
          pledge_count: dbNeed.pledge_count || 0,
          status: dbNeed.status,
          photo_url: dbNeed.photo_url,
          story: dbNeed.story,
          impact_statement: dbNeed.impact_statement,
          deadline: dbNeed.deadline,
          created_at: dbNeed.created_at,
          profile: {
            name: dbNeed.profile?.full_name || "Artisan",
            location_lga: dbNeed.location_lga || dbNeed.profile?.location_lga || "Local",
            location_state: dbNeed.location_state || dbNeed.profile?.location_state || "Nigeria",
            trade_category: dbNeed.profile?.trade_category || "trade",
            badge_level: dbNeed.profile?.badge_level || "level_1_community_member",
            vouch_count: dbNeed.profile?.vouch_count || 0,
            photo_url: dbNeed.profile?.photo_url || "",
          },
        }
      }
    }
  } catch {}

  // Fall back to demo data
  return DEMO_NEEDS[needId] || DEMO_NEEDS["demo-need-001"]
}

export default async function PaymentPage({ params }: PaymentPageProps) {
  const { needId } = await params
  const need = await getNeed(needId)

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

        {/* Single-column layout: pledge flow */}
        <div className="flex flex-col gap-8">
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
