import { Metadata } from "next"
import { Button } from "@/components/ui/Button"
import { 
  ChevronLeft,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"
import { PledgeFlow } from "@/components/pledge/PledgeFlow"

interface PaymentPageProps {
  params: { needId: string }
}

/**
 * DEMO MODE: Returns rich mock data for any need ID.
 * In a real implementation, this would fetch from Supabase.
 */

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
      photo_url: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=200",
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
      location_state: "lagos",
      trade_category: "tailor",
      badge_level: "level_3_established",
      vouch_count: 8,
      photo_url: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=200",
    },
  },
  // Add more mock needs as needed
}

export async function generateMetadata({ params }: PaymentPageProps): Promise<Metadata> {
  const need = MOCK_NEEDS[params.needId] || MOCK_NEEDS["demo-need-001"]
  return {
    title: `Back ${need.profile.name} - ${need.item_name} | BuildBridge`,
    description: `Support ${need.profile.name}'s need for a ${need.item_name}.`,
  }
}

export default async function PaymentPage({ params }: PaymentPageProps) {
  const need = MOCK_NEEDS[params.needId] || MOCK_NEEDS["demo-need-001"]

  return (
    <main className="min-h-screen bg-background pt-24 pb-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link href={`/needs/${need.id}`} className="flex items-center gap-2 text-label-large font-bold text-on-surface-variant hover:text-primary transition-colors">
            <ChevronLeft className="h-5 w-5" />
            Back to Need
          </Link>
          <Link href="/browse" className="flex items-center gap-2 text-label-large font-bold text-on-surface-variant hover:text-primary transition-colors">
            <ArrowLeft className="h-5 w-5" />
            Browse Needs
          </Link>
        </div>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-display-small font-black text-on-surface leading-tight mb-4">
            Back <span className="text-primary">{need.profile.name}</span>
          </h1>
          <p className="text-body-large text-on-surface-variant">
            Support <span className="font-bold text-on-surface">{need.profile.name}</span>'s need for a{" "}
            <span className="font-bold text-on-surface">{need.item_name}</span>.
          </p>
        </div>

        {/* Pledge Flow - Always show the flow */}
        <div className="bg-surface rounded-3xl p-6 md:p-8 border border-outline-variant shadow-lg">
          <PledgeFlow 
            needId={need.id}
            needName={need.item_name}
            tradespersonName={need.profile.name}
            goalAmount={need.item_cost}
            alwaysShow={true}
          />
        </div>

        {/* Trust indicators */}
        <div className="mt-10 p-6 bg-surface-variant/30 rounded-3xl border border-outline-variant">
          <h3 className="text-title-medium font-black text-on-surface mb-4">Why Back with BuildBridge?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <div className="text-label-small uppercase font-bold text-primary tracking-widest">Secure Escrow</div>
              <p className="text-body-small text-on-surface-variant">Funds are held securely and only released when the tradesperson provides proof of purchase.</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-label-small uppercase font-bold text-primary tracking-widest">Zero Fees</div>
              <p className="text-body-small text-on-surface-variant">We charge 0% fees to tradespeople. 100% of your pledge goes to them.</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-label-small uppercase font-bold text-primary tracking-widest">Verified Impact</div>
              <p className="text-body-small text-on-surface-variant">Every funded need requires proof of use, so you see exactly what your backing made possible.</p>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}