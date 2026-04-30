import { Metadata } from "next"
import { ChevronLeft, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { PledgeFlow } from "@/components/pledge/PledgeFlow"
import { notFound } from "next/navigation"

interface PaymentPageProps {
  params: Promise<{ needId: string }>
}

async function getNeed(needId: string) {
  const supabase = await createClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from("needs")
    .select(`
      id,
      item_name,
      item_cost,
      funded_amount,
      pledge_count,
      status,
      photo_url,
      story,
      impact_statement,
      deadline,
      created_at,
      profiles:profile_id (
        full_name,
        location_lga,
        location_state,
        trade_category,
        badge_level,
        vouch_count
      )
    `)
    .eq("id", needId)
    .single()

  if (error || !data) return null
  return data
}

export async function generateMetadata({ params }: PaymentPageProps): Promise<Metadata> {
  const { needId } = await params
  const need = await getNeed(needId)
  if (!need) return { title: "Payment | BuildBridge" }

  const profile = need.profiles as any
  const name = profile?.full_name || "a tradesperson"
  return {
    title: `Back ${name} — ${need.item_name} | BuildBridge`,
    description: `Support ${name}'s need for a ${need.item_name} on BuildBridge.`,
  }
}

export default async function PaymentPage({ params }: PaymentPageProps) {
  const { needId } = await params
  const need = await getNeed(needId)

  if (!need) notFound()

  const profile = need.profiles as any
  const artisanName = profile?.full_name || "this tradesperson"
  const fundedPct = need.item_cost > 0
    ? Math.round(((need.funded_amount || 0) / need.item_cost) * 100)
    : 0

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
            <span className="text-primary italic">{artisanName}</span>
          </h1>
          <p className="text-lg text-on-surface-variant font-medium leading-relaxed">
            Support{" "}
            <span className="font-bold text-on-surface">{artisanName}</span>
            's need for a{" "}
            <span className="font-bold text-on-surface">{need.item_name}</span>.
          </p>
        </div>

        {/* Pledge flow */}
        <div className="flex flex-col gap-8">
          <div className="w-full">
            <div className="bg-surface rounded-[2.5rem] border border-outline-variant/30 shadow-[0_20px_60px_rgba(0,0,0,0.07)] overflow-hidden">
              <PledgeFlow
                needId={need.id}
                needName={need.item_name}
                tradespersonName={artisanName}
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