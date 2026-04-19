import { Metadata } from "next"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Info,
  ChevronLeft,
  Share2
} from "lucide-react"
import Link from "next/link"
import { PledgeFlow } from "@/components/pledge/PledgeFlow"

interface NeedPageProps {
  params: { id: string }
}

/**
 * DEMO MODE: Returns rich mock data for any need ID.
 * No Supabase queries are made.
 *
 * To re-enable Supabase:
 *   1. Import createClient from "@/lib/supabase/server"
 *   2. Restore the supabase.from("needs").select(...) query
 *   3. Replace mock data with real data
 */

// Mock need data for demo
const MOCK_NEED = {
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
}

export async function generateMetadata({ params }: NeedPageProps): Promise<Metadata> {
  return {
    title: `${MOCK_NEED.item_name} | BuildBridge`,
    description: MOCK_NEED.story.slice(0, 160),
  }
}

export default async function NeedDetailPage({ params }: NeedPageProps) {
  const need = MOCK_NEED

  const formattedGoal = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(need.item_cost / 100)

  const formattedRaised = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(need.funded_amount / 100)

  const percentage = (need.funded_amount / need.item_cost) * 100
  
  // Calculate days remaining
  const deadlineDate = new Date(need.deadline)
  const today = new Date()
  const diffDays = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  const daysLeft = Math.max(0, diffDays)

  return (
    <main className="min-h-screen bg-background pt-24 pb-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Navigation & Actions */}
        <div className="flex items-center justify-between mb-8">
           <Link href="/browse" className="flex items-center gap-2 text-label-large font-bold text-on-surface-variant hover:text-primary transition-colors">
              <ChevronLeft className="h-5 w-5" />
              Back to Browse
           </Link>
           <Button variant="ghost" size="sm" className="rounded-full">
              <Share2 className="h-5 w-5 mr-2" />
              Share
           </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           
           {/* Left Column: Media & Story */}
           <div className="lg:col-span-7 flex flex-col gap-8">
              <div className="aspect-[16/10] w-full rounded-3xl overflow-hidden bg-surface-variant border border-outline-variant shadow-lg">
                 <img 
                    src={need.photo_url} 
                    alt={need.item_name} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                 />
              </div>

              <div className="flex flex-col gap-6">
                 <h1 className="text-display-small font-black text-on-surface leading-tight">
                    Help {need.profile.name} get a <span className="text-primary">{need.item_name}</span>
                 </h1>

                 {/* Impact Highlight */}
                 <div className="p-6 bg-badge-2/5 border border-badge-2/20 rounded-2xl flex gap-4">
                    <ShieldCheck className="h-8 w-8 text-badge-2 flex-shrink-0" />
                    <div>
                       <p className="text-label-medium uppercase font-bold text-badge-2 tracking-widest mb-1">Impact Goal</p>
                       <p className="text-body-large font-black text-on-surface">
                          &quot;{need.impact_statement || "Using this tool to grow my business and hire more hands."}&quot;
                       </p>
                    </div>
                 </div>

                 <div className="flex flex-col gap-4">
                    <h2 className="text-headline-small font-black text-on-surface">The Story</h2>
                    <p className="text-body-large text-on-surface-variant leading-relaxed whitespace-pre-line">
                       {need.story}
                    </p>
                 </div>
              </div>
           </div>

           {/* Right Column: Pledge & Profile Sidebar */}
           <div className="lg:col-span-5 flex flex-col gap-8">
              
               {/* Pledge Card */}
               <div className="p-8 rounded-3xl bg-surface border-2 border-primary/20 shadow-xl flex flex-col gap-6">
                 <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-end">
                       <span className="text-display-small font-black text-on-surface">{formattedRaised}</span>
                       <span className="text-body-medium text-on-surface-variant font-bold mb-1">of {formattedGoal} goal</span>
                    </div>
                    <ProgressBar percentage={percentage} className="h-4" />
                    <div className="flex justify-between text-label-large font-bold text-on-surface-variant mt-1">
                       <span>{Math.floor(percentage)}% funded</span>
                       <span className="flex items-center gap-1 text-primary">
                          <Calendar className="h-4 w-4" />
                          {daysLeft} days left
                       </span>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4 py-4 border-y border-outline-variant/30">
                    <div className="flex flex-col items-center p-3 rounded-2xl bg-surface-variant/30">
                       <span className="text-headline-small font-black text-on-surface">{need.pledge_count}</span>
                       <span className="text-label-small uppercase font-bold text-on-surface-variant">Pledges</span>
                    </div>
                    <div className="flex flex-col items-center p-3 rounded-2xl bg-surface-variant/30">
                       <span className="text-headline-small font-black text-on-surface">{need.profile.vouch_count}</span>
                       <span className="text-label-small uppercase font-bold text-on-surface-variant">Vouches</span>
                    </div>
                 </div>

                 {/* Pledge Flow Trigger */}
                 <PledgeFlow 
                    needId={need.id} 
                    needName={need.item_name}
                    tradespersonName={need.profile.name}
                    goalAmount={need.item_cost}
                 />

                 <div className="p-4 bg-surface-variant/50 rounded-2xl flex gap-3">
                    <Info className="h-5 w-5 text-on-surface-variant flex-shrink-0" />
                    <p className="text-label-small text-on-surface-variant font-medium">
                       BuildBridge Escrow: Pledges are only released once the tradesperson uploads proof of purchase.
                    </p>
                 </div>
              </div>

              {/* Tradesperson Profile Quick View */}
              <div className="p-6 rounded-3xl bg-surface-variant/30 border border-outline-variant flex flex-col gap-4">
                 <p className="text-label-small uppercase font-bold text-on-surface-variant tracking-widest">About the Tradesperson</p>
                 <div className="flex items-center gap-4">
                    <img 
                       src={need.profile.photo_url} 
                       alt={need.profile.name} 
                       className="h-14 w-14 rounded-full border-2 border-surface shadow-sm object-cover"
                       loading="lazy"
                    />
                    <div className="flex flex-col">
                       <h3 className="text-title-medium font-black text-on-surface">{need.profile.name}</h3>
                       <div className="flex items-center gap-1 text-body-small text-on-surface-variant">
                          <MapPin className="h-3 w-3" />
                          {need.profile.location_lga}, {need.profile.location_state.toUpperCase()}
                       </div>
                    </div>
                 </div>
                 <Badge level={need.profile.badge_level === 'level_4_platform_verified' ? 4 : need.profile.badge_level === 'level_3_established' ? 3 : need.profile.badge_level === 'level_2_trusted_tradesperson' ? 2 : need.profile.badge_level === 'level_1_community_member' ? 1 : 0} />
              </div>

              {/* Recent Backers */}
              <div className="p-6 rounded-3xl bg-surface border border-outline-variant flex flex-col gap-4">
                 <p className="text-label-small uppercase font-bold text-on-surface-variant tracking-widest flex items-center justify-between">
                    Recent Backers 
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-[10px]">{need.pledge_count}</span>
                 </p>
                 <div className="flex flex-col gap-4 divide-y divide-outline-variant/30">
                    {[
                      { name: "Chinedu O.", time: "2 hours ago", amount: "₦20,000", comment: "Keep building! We need more tailors like you." },
                      { name: "Anonymous", time: "5 hours ago", amount: "₦50,000", comment: "" },
                      { name: "Sarah M.", time: "1 day ago", amount: "₦10,000", comment: "Happy to support." }
                    ].map((backer, i) => (
                      <div key={i} className="pt-4 first:pt-0 flex flex-col gap-1">
                         <div className="flex justify-between items-baseline">
                            <span className="font-bold text-sm text-on-surface">{backer.name}</span>
                            <span className="text-xs font-black text-primary">{backer.amount}</span>
                         </div>
                         <div className="flex justify-between items-center text-xs text-on-surface-variant mt-1">
                            <span>{backer.time}</span>
                         </div>
                         {backer.comment && (
                            <p className="text-sm font-medium text-on-surface-variant/80 mt-2 bg-surface-variant/20 p-3 rounded-xl rounded-tl-none relative leading-snug">
                               "{backer.comment}"
                            </p>
                         )}
                      </div>
                    ))}
                 </div>
                 <Button variant="secondary" className="w-full mt-2 rounded-xl text-xs font-bold uppercase tracking-widest bg-surface-variant text-on-surface hover:text-primary">See All</Button>
              </div>

           </div>
        </div>
      </div>
    </main>
  )
}
