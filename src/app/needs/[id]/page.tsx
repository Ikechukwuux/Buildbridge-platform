import { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Info,
  ChevronLeft,
  AlertTriangle,
  Heart
} from "lucide-react"
import Link from "next/link"
import { PledgeFlow } from "@/components/pledge/PledgeFlow"
import { ShareButton } from "@/components/ui/ShareButton"
import { formatStateName } from "@/lib/utils"
import { DEMO_NEEDS } from "@/lib/data/demo-needs"

interface NeedPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: NeedPageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  
  try {
    const { data: need } = await supabase
      .from('needs')
      .select('item_name, story')
      .eq('id', id)
      .single()
    
    if (need) {
      return {
        title: `${need.item_name} | BuildBridge`,
        description: need.story?.slice(0, 160) || "Support a tradesperson's equipment need on BuildBridge.",
      }
    }
  } catch {}

  const demo = DEMO_NEEDS[id]
  if (demo) {
    return {
      title: `${demo.item_name} | BuildBridge`,
      description: demo.story?.slice(0, 160) || "Support a tradesperson's equipment need on BuildBridge.",
    }
  }
  
  return {
    title: "Need Details | BuildBridge",
    description: "Support a tradesperson's equipment need on BuildBridge.",
  }
}

export default async function NeedDetailPage({ params }: NeedPageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  let need: any = null
  
  try {
    const { data: dbNeed, error } = await supabase
      .from('needs')
      .select(`
        *,
        profile:profiles(*)
      `)
      .eq('id', id)
      .single()
      
    if (dbNeed && !error) {
      need = {
        ...dbNeed,
        profile: {
          name: dbNeed.profile?.full_name || "Artisan",
          location_lga: dbNeed.location_lga || dbNeed.profile?.location_lga || "Local",
          location_state: dbNeed.location_state || dbNeed.profile?.location_state || "Nigeria",
          trade_category: dbNeed.profile?.trade_category || "trade",
          badge_level: dbNeed.profile?.badge_level || "level_1_community_member",
          vouch_count: dbNeed.profile?.vouch_count || 0,
          photo_url: dbNeed.profile?.photo_url || "",
        }
      }
    }
  } catch (err) {
    console.error("Failed to fetch need details:", err)
  }

  if (!need) {
    need = DEMO_NEEDS[id]
  }

  if (!need) {
    return (
      <main className="min-h-screen bg-background pt-24 pb-20 flex items-center justify-center">
        <div className="text-center flex flex-col items-center gap-6 max-w-md px-4">
          <AlertTriangle className="h-16 w-16 text-on-surface-variant/30" />
          <h1 className="text-display-small font-black text-on-surface">Need Not Found</h1>
          <p className="text-body-large text-on-surface-variant">
            This need may have been removed or is not yet published. Browse other active needs to support.
          </p>
          <Link href="/browse">
            <Button className="rounded-full px-8 font-black text-sm">
              Browse Needs
            </Button>
          </Link>
        </div>
      </main>
    )
  }

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

  const percentage = need.item_cost > 0 ? (need.funded_amount / need.item_cost) * 100 : 0
  
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
           <ShareButton 
              title={`Help ${need.profile.name} get a ${need.item_name}`}
              text={`Support ${need.profile.name}'s need on BuildBridge!`}
              url={`/needs/${need.id}`}
              className="rounded-full"
           />
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
                    {need.profile.photo_url ? (
                      <img 
                         src={need.profile.photo_url} 
                         alt={need.profile.name} 
                         className="h-14 w-14 rounded-full border-2 border-surface shadow-sm object-cover"
                         loading="lazy"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-full bg-primary/10 border-2 border-surface shadow-sm flex items-center justify-center">
                        <span className="text-xl font-black text-primary">{(need.profile.name || "A").charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                    <div className="flex flex-col">
                       <h3 className="text-title-medium font-black text-on-surface">{need.profile.name}</h3>
                       <div className="flex items-center gap-1 text-body-small text-on-surface-variant">
                          <MapPin className="h-3 w-3" />
                           {need.profile.location_lga}, {formatStateName(need.profile.location_state)}
                       </div>
                    </div>
                 </div>
                 <Badge level={need.profile.badge_level === 'level_1_community_member' ? 1 : 0} />
              </div>

              {/* Recent Support */}
              <div className="p-6 rounded-3xl bg-surface border border-outline-variant flex flex-col gap-4">
                 <p className="text-label-small uppercase font-bold text-on-surface-variant tracking-widest flex items-center justify-between">
                    Recent Support
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-[10px]">{need.pledge_count}</span>
                 </p>
                 <div className="flex flex-col items-center gap-3 py-4">
                    <Heart className="h-8 w-8 text-primary/30" />
                    <p className="text-body-medium font-medium text-on-surface-variant text-center">
                       {need.pledge_count > 0 
                         ? `${need.pledge_count} supporter${need.pledge_count !== 1 ? 's' : ''} have backed this need. Be the next one!` 
                         : "Be the first to support this need!"}
                    </p>
                 </div>
              </div>

           </div>
        </div>
      </div>
    </main>
  )
}
