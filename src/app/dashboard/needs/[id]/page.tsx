"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { Badge } from "@/components/ui/Badge"
import { Card } from "@/components/ui/Card"
import { 
  ChevronLeft, 
  MapPin, 
  Calendar, 
  Users, 
  ShieldCheck, 
  Heart, 
  Share2,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  TrendingUp,
  Award,
  Sparkles,
  Settings,
  Loader2,
  ImageOff
} from "lucide-react"
import { motion } from "framer-motion"
import { cn, handleShare } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

export default function NeedDetailPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const id = params.id as string

  const [need, setNeed] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    const fetchNeedDetail = async () => {
      setLoading(true)
      try {
        // Fetch need with profile data
        const { data: needData, error: needError } = await supabase
          .from('needs')
          .select(`
            *,
            profiles:profile_id (
              id,
              full_name,
              trade_category,
              location_state,
              location_lga,
              badge_level,
              vouch_count
            )
          `)
          .eq('id', id)
          .single()

        if (needError || !needData) {
          console.error("Failed to fetch need:", needError)
          router.push('/dashboard')
          return
        }

        setNeed(needData)
        setProfile(needData.profiles)
      } catch (err) {
        console.error("Need detail fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchNeedDetail()
  }, [id])

  if (loading) {
    return (
      <main className="min-h-screen bg-surface pt-24 pb-20 flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </main>
    )
  }

  if (!need) {
    return (
      <main className="min-h-screen bg-surface pt-24 pb-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-headline-medium font-black text-on-surface mb-4">Need not found</p>
          <Button onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
        </div>
      </main>
    )
  }

  const percentage = need.item_cost > 0 ? ((need.funded_amount || 0) / need.item_cost) * 100 : 0
  const isCompleted = need.status === 'completed' || percentage >= 100

  const deadlineDate = new Date(need.deadline)
  const today = new Date()
  const diffTime = deadlineDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  const daysRemaining = Math.max(0, diffDays)

  const artisanName = profile?.full_name || "Artisan"
  const tradeCategory = profile?.trade_category?.replace(/_/g, ' ') || "Trade"
  const locationState = profile?.location_state?.replace(/_/g, ' ') || ""
  const locationLga = profile?.location_lga || ""
  const locationDisplay = locationLga ? `${locationLga}, ${locationState}` : locationState

  return (
    <main className="min-h-screen bg-surface pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation */}
        <button 
           onClick={() => router.back()}
           className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors mb-8 group"
        >
           <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
           Back to Dashboard
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           
           {/* Left Column: Media & Story */}
           <div className="lg:col-span-8 flex flex-col gap-10">
              
              {/* Hero Image */}
              <div className="relative rounded-[3rem] overflow-hidden aspect-video shadow-2xl bg-surface-variant/30">
                 {need.photo_url && !imageError ? (
                   <>
                     <img 
                        src={need.photo_url} 
                        alt={need.item_name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={() => setImageError(true)}
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                   </>
                 ) : (
                   <div className="w-full h-full flex items-center justify-center">
                     <ImageOff className="h-24 w-24 text-on-surface-variant/20" />
                   </div>
                 )}
                 
                 <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
                    <div className="flex flex-col gap-2">
                       <div className="flex items-center gap-3">
                          <span className="px-4 py-1.5 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-widest">
                             {tradeCategory}
                          </span>
                          {isCompleted && (
                             <span className="px-4 py-1.5 rounded-full bg-success text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                <CheckCircle2 className="h-3 w-3" />
                                Completed
                             </span>
                          )}
                       </div>
                       <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                          {need.item_name}
                       </h1>
                    </div>
                 </div>
              </div>

              {/* Story Section */}
              <section className="bg-white rounded-[3rem] p-10 shadow-sm border border-outline-variant/30">
                 <div className="flex items-center gap-4 mb-8">
                    <div className="h-10 w-1 bg-primary rounded-full" />
                    <h2 className="text-2xl font-black text-on-surface">The Story</h2>
                 </div>
                 <p className="text-lg text-on-surface-variant leading-relaxed font-medium">
                    {need.story || "No story provided yet."}
                 </p>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 pt-12 border-t border-outline-variant/30">
                    <div className="flex items-start gap-4">
                       <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                          <MapPin className="h-6 w-6" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Location</p>
                          <p className="text-base font-bold text-on-surface">{locationDisplay || "Not specified"}</p>
                       </div>
                    </div>
                    <div className="flex items-start gap-4">
                       <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                          <Calendar className="h-6 w-6" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Deadline</p>
                          <p className="text-base font-bold text-on-surface">
                            {deadlineDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                            {daysRemaining > 0 ? ` (${daysRemaining} days left)` : ' (Ended)'}
                          </p>
                       </div>
                    </div>
                 </div>
              </section>

              {/* Impact Statement */}
              {need.impact_statement && (
                <section className="bg-primary/5 rounded-[2.5rem] p-8 shadow-sm border border-primary/10">
                   <h3 className="text-lg font-black text-on-surface mb-4 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Expected Impact
                   </h3>
                   <p className="text-base font-medium text-on-surface-variant leading-relaxed">
                     {need.impact_statement}
                   </p>
                </section>
              )}

           </div>

           {/* Right Column: Funding & Artisan Info */}
           <div className="lg:col-span-4 flex flex-col gap-8">
              
              <div className="sticky top-24 flex flex-col gap-8">
                 {/* Funding Card */}
                 <Card className="p-8 bg-white border border-outline-variant/30 shadow-2xl rounded-[3rem]">
                    <div className="flex flex-col gap-8">
                       
                       <div className="flex flex-col gap-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary">Progress Target</span>
                          <div className="flex items-baseline gap-2">
                             <span className="text-4xl font-black text-on-surface">
                               ₦{new Intl.NumberFormat().format((need.funded_amount || 0) / 100)}
                             </span>
                             <span className="text-xs font-bold text-on-surface-variant">raised</span>
                          </div>
                          <p className="text-sm font-bold text-on-surface-variant">
                            out of ₦{new Intl.NumberFormat().format(need.item_cost / 100)}
                          </p>
                       </div>

                       <div className="space-y-4">
                          <div className="flex justify-between items-end">
                             <span className="text-xs font-black text-on-surface uppercase tracking-widest">{Math.min(100, Math.round(percentage))}% complete</span>
                             <span className="text-xs font-bold text-on-surface-variant">{need.pledge_count || 0} Backers</span>
                          </div>
                          <ProgressBar percentage={percentage} className="h-4 bg-surface-variant/20 shadow-inner" />
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 rounded-3xl bg-surface-variant/20 border border-white flex flex-col gap-1">
                             <Users className="h-4 w-4 text-primary mb-1" />
                             <span className="text-xl font-black text-on-surface">{need.pledge_count || 0}</span>
                             <span className="text-[10px] font-black uppercase text-on-surface-variant tracking-wider">Supporters</span>
                          </div>
                          <div className="p-4 rounded-3xl bg-surface-variant/20 border border-white flex flex-col gap-1">
                             <Award className="h-4 w-4 text-primary mb-1" />
                             <span className="text-xl font-black text-on-surface">{profile?.vouch_count || 0}</span>
                             <span className="text-[10px] font-black uppercase text-on-surface-variant tracking-wider">Vouches</span>
                          </div>
                       </div>

                       <Button 
                          className={cn(
                             "w-full h-16 rounded-[2rem] text-lg font-black shadow-xl transition-all hover:scale-[1.02]",
                             isCompleted ? "bg-success text-white shadow-success/20" : "bg-primary text-white shadow-primary/20"
                          )}
                          disabled={isCompleted}
                       >
                          {isCompleted ? (
                             <span className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5" />
                                Successfully Funded
                             </span>
                          ) : (
                             "Pledge Support Now"
                          )}
                       </Button>

                       <div className="flex items-center justify-between pt-4 border-t border-outline-variant/30">
                          <button 
                             onClick={(e) => {
                               e.preventDefault();
                               e.stopPropagation();
                               handleShare(`Help ${artisanName} get a ${need.item_name}`, `Support ${artisanName}'s need on BuildBridge!`, `${window.location.origin}/needs/${need.id}`);
                             }}
                             className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
                          >
                             <Share2 className="h-4 w-4" />
                             Share Progress
                          </button>
                          <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">
                             <ShieldCheck className="h-4 w-4" />
                             Trust Assurance
                          </button>
                       </div>
                    </div>
                 </Card>

                 {/* Artisan Profile Card */}
                 <Card className="p-8 bg-surface-variant/10 border border-outline-variant/10 rounded-[3rem]">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-6 text-center">About the Artisan</p>
                    <div className="flex flex-col items-center gap-4 text-center">
                       <div className="relative">
                          {profile?.photo_url ? (
                            <img 
                               src={profile.photo_url}
                               alt={artisanName}
                               className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-xl"
                               onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                            />
                          ) : (
                            <div className="h-24 w-24 rounded-full bg-primary/10 border-4 border-white shadow-xl flex items-center justify-center">
                              <span className="text-3xl font-black text-primary">{artisanName.charAt(0)}</span>
                            </div>
                          )}
                          <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-2 border-2 border-white text-white">
                             <ShieldCheck className="h-4 w-4" />
                          </div>
                       </div>
                       <div>
                          <h3 className="text-xl font-black text-on-surface">{artisanName}</h3>
                          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">{tradeCategory}</p>
                          <p className="text-xs text-on-surface-variant font-medium leading-relaxed px-4">
                             {locationDisplay || "Location not specified"}
                          </p>
                       </div>
                    </div>
                 </Card>
              </div>

           </div>

        </div>

      </div>
    </main>
  )
}
