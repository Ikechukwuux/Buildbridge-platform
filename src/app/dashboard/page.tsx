"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { TrustTracker } from "@/components/dashboard/TrustTracker"
import { NINVerificationForm } from "@/components/dashboard/NINVerificationForm"
import { SubmitImpactModal } from "@/components/dashboard/SubmitImpactModal"
import { Button } from "@/components/ui/Button"
import { NeedCard, NeedCardSkeleton } from "@/components/ui/NeedCard"
import { EmptyState } from "@/components/ui/EmptyState"
import { BadgeDisplay } from "@/components/ui/BadgeDisplay"
import {
  Plus,
  Settings,
  TrendingUp,
  Users,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  CheckCircle2
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { GoalGradientCard } from "@/components/dashboard/GoalGradientCard"
import { CreateNeedFlow } from "@/components/dashboard/CreateNeedFlow"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()

  const [profile, setProfile] = useState<any>(null)
  const [needs, setNeeds] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isSubmittingImpact, setIsSubmittingImpact] = useState(false)
  const [selectedNeedForImpact, setSelectedNeedForImpact] = useState<any>(null)
  const [showCopied, setShowCopied] = useState(false)
  const [userName, setUserName] = useState("Artisan")
  const [isCreatingNeed, setIsCreatingNeed] = useState(false)

  const fetchDashboardData = async () => {
    setLoading(true)


    try {
      // 1. Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()

      if (userError || !user) {
        // Not authenticated - redirect to login immediately
        router.push(`/login?redirectTo=/dashboard`)
        return
      }

      console.log('Dashboard auth check passed:', user.id)

      // Get display name from user metadata
      const fullName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Artisan"
      setUserName(fullName)

      // Real data fetching applies to all users including demo
      // 2. Get profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (profileData) {
        setProfile(profileData)

        // 3. Get needs for this profile
        const { data: needsData, error: needsError } = await supabase
          .from('needs')
          .select('*')
          .eq('profile_id', profileData.id)
          .order('created_at', { ascending: false })

        if (needsData) {
          setNeeds(needsData)
        }
      } else {
        // Profile might not exist yet (trigger might have created it)
        setProfile({
          full_name: fullName,
          badge_level: 'level_0_unverified',
          vouch_count: 0,
          delivered_count: 0,
          id: null
        })
        setNeeds([])
      }
    } catch (err) {
      console.error("Dashboard data fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const handleVerificationSuccess = async () => {
    await fetchDashboardData()
    setIsVerifying(false)
  }

  const handleImpactSuccess = async () => {
    await fetchDashboardData()
    setIsSubmittingImpact(false)
  }

  const handleVouchRequest = () => {
    if (!profile?.id) return
    const vouchUrl = `${window.location.origin}/profile/${profile.id}/vouch`
    navigator.clipboard.writeText(vouchUrl)
    setShowCopied(true)
    setTimeout(() => setShowCopied(false), 3000)
  }

  // Calculate impact stats from needs
  const calculateImpactStats = () => {
    if (!needs.length) {
      return { totalFunded: 0, totalBackers: 0 }
    }

    const totalFunded = needs.reduce((sum, need) => sum + (need.funded_amount || 0), 0)
    const totalBackers = needs.reduce((sum, need) => sum + (need.pledge_count || 0), 0)

    return { totalFunded, totalBackers }
  }

  const { totalFunded, totalBackers } = calculateImpactStats()

  if (loading) {
    return (
      <div className="w-full flex flex-col gap-12 animate-pulse">
        <div className="h-40 bg-surface-variant/30 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-64 bg-surface-variant/30 rounded-3xl" />
          <div className="h-64 bg-surface-variant/30 rounded-3xl" />
        </div>
      </div>
    )
  }

  const badgeEnumMapping: any = {
    'level_0_unverified': 0,
    'level_1_community_member': 1,
    'level_2_trusted_tradesperson': 2,
    'level_3_established': 3,
    'level_4_platform_verified': 4
  }

  const firstName = userName.split(' ')[0]

  return (
    <div className="flex flex-col gap-10 pb-10">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
         <div className="flex flex-col gap-2">
             <h1 className="text-4xl md:text-5xl font-black text-on-surface tracking-tight">
                Welcome back, <span className="text-primary italic">{firstName}!</span>
             </h1>
            <p className="text-body-large text-on-surface-variant max-w-xl">
               Manage your funding needs and build your trade reputation on BuildBridge.
            </p>
         </div>
         <div className="flex gap-4">
            <button 
               onClick={() => router.push('/dashboard/create-need')}
               className="h-14 px-8 rounded-[1.5rem] gap-2 text-title-medium shadow-xl shadow-primary/20 bg-primary text-white flex items-center justify-center hover:scale-[1.02] active:scale-[0.98] transition-all font-black"
            >
               <Plus className="h-6 w-6" />
               New Funding Need
            </button>
         </div>
      </div>

      {/* BENTO GRID MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ── LEFT BENTO COLUMN (col-span-8) ── */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Main Focus: Guidance or Celebration */}
          {needs.length === 0 ? (
            <GoalGradientCard 
              progress={20} 
              onAction={() => setIsCreatingNeed(true)} 
            />
          ) : (
            <div className="relative overflow-hidden p-10 rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/10 group">
              <div className="absolute top-0 right-0 p-8 opacity-10 -rotate-12 group-hover:rotate-0 transition-transform duration-500">
                <Sparkles className="w-24 h-24 text-primary" />
              </div>
              <div className="relative z-10 flex flex-col gap-4">
                <h2 className="text-3xl font-black text-on-surface tracking-tight leading-tight">
                  Your craftsmanship is <br />
                  building a <span className="text-primary italic font-black">stronger community.</span>
                </h2>
                <p className="text-on-surface-variant font-medium max-w-md">
                  Keep updating your story and engaging with backers to fund your needs faster.
                </p>
              </div>
            </div>
          )}

          {/* Active Needs Section */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-display-small font-black text-on-surface tracking-tight">Active Needs</h2>
              <Link href="/dashboard/needs" className="text-label-large font-bold text-primary flex items-center gap-1 hover:underline">
                View All <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {needs.length > 0 ? (
              <div className="flex flex-col gap-6">
                {/* Success Story Banner */}
                {needs.some(n => n.status === 'completed') && (
                  <div className="p-6 bg-primary/5 border border-primary/20 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center shrink-0 shadow-inner">
                        <Sparkles className="h-6 w-6" />
                      </div>
                      <div className="flex flex-col">
                        <h4 className="text-sm font-black text-on-surface">Share your success stories!</h4>
                        <p className="text-xs text-on-surface-variant font-medium">You have funded needs ready for the Impact Wall.</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => {
                        const readyNeed = needs.find(n => n.status === 'completed');
                        setSelectedNeedForImpact(readyNeed);
                        setIsSubmittingImpact(true);
                      }}
                      className="rounded-[1.5rem] px-8 font-black shadow-lg hover:scale-105 transition-all"
                    >
                      Share Story
                    </Button>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {needs.map(need => (
                    <NeedCard 
                      key={need.id} 
                      need={{...need, profile}} 
                      onClick={() => router.push(`/dashboard/needs/${need.id}`)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState 
                 icon={Sparkles}
                 title="Your first goal starts here"
                 description="Create a need to get tools, equipment, or materials backed by the community."
                 actionLabel="Start a Request"
                 onAction={() => router.push('/dashboard/create-need')}
              />
            )}
          </div>



          {/* Badge Display Area */}
          <div className="pt-8 border-t border-outline-variant">
            <BadgeDisplay />
          </div>

        </div>

        {/* ── RIGHT BENTO COLUMN (col-span-4) ── */}
        <div className="lg:col-span-4 flex flex-col gap-8 lg:sticky lg:top-24 h-fit">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
             <div className="p-6 rounded-[2rem] bg-surface border border-outline-variant/30 flex flex-col justify-center items-start gap-2 shadow-sm hover:shadow-md transition-all group">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                   <TrendingUp className="h-5 w-5" />
                </div>
                <span className="text-3xl font-black text-on-surface tracking-tight">{needs.filter(n => n.status === 'active').length}</span>
                <span className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant/50">Active Needs</span>
             </div>
             <div className="p-6 rounded-[2rem] bg-surface border border-outline-variant/30 flex flex-col justify-center items-start gap-2 shadow-sm hover:shadow-md transition-all group">
                <div className="w-10 h-10 rounded-2xl bg-badge-3/10 text-badge-3 flex items-center justify-center group-hover:scale-110 transition-transform">
                   <Users className="h-5 w-5" />
                </div>
                <span className="text-3xl font-black text-on-surface tracking-tight">{totalBackers}</span>
                <span className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant/50">Total Backers</span>
             </div>
          </div>

          {/* Trust Tracking Card */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-black text-on-surface-variant uppercase tracking-widest pl-2">
              Reputation
            </h3>
            <div className="p-1 rounded-[2.5rem] bg-surface border border-outline-variant/30 shadow-sm">
               <TrustTracker 
                 currentLevel={badgeEnumMapping[profile?.badge_level || 'level_0_unverified']}
                 vouches={profile?.vouch_count || 0}
                 deliveries={profile?.delivered_count || 0}
                 onVerifyClick={() => setIsVerifying(true)}
                 onVouchRequest={handleVouchRequest}
               />
            </div>
          </div>

          {/* Impact Snapshot Card */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-black text-on-surface-variant uppercase tracking-widest pl-2">
              Impact History
            </h3>
            <div className="p-8 bg-surface border border-outline-variant shadow-sm rounded-[2.5rem] flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between p-4 bg-surface-variant/10 rounded-[1.5rem] border border-white/50">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-badge-2" />
                    <span className="text-sm font-bold">Funds Raised</span>
                  </div>
                  <span className="text-lg font-black tracking-tight">
                    {new Intl.NumberFormat("en-NG", {
                      style: "currency",
                      currency: "NGN",
                      maximumFractionDigits: 0,
                    }).format(totalFunded)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-surface-variant/10 rounded-[1.5rem] border border-white/50">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-badge-3" />
                    <span className="text-sm font-bold">Total Backers</span>
                  </div>
                  <span className="text-lg font-black tracking-tight">{totalBackers}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <AnimatePresence>
        {showCopied && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-on-surface text-surface py-3 px-6 rounded-2xl shadow-2xl font-bold flex items-center gap-2"
          >
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Vouch link copied to clipboard!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlays */}
      <AnimatePresence>
        {isVerifying && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-on-surface/80 backdrop-blur-md"
               onClick={() => setIsVerifying(false)}
            />
            <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="relative w-full max-w-lg bg-surface rounded-3xl p-10 shadow-2xl overflow-hidden"
            >
               <NINVerificationForm 
                  onSuccess={handleVerificationSuccess} 
                  onClose={() => setIsVerifying(false)} 
               />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSubmittingImpact && selectedNeedForImpact && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-on-surface/80 backdrop-blur-md"
               onClick={() => setIsSubmittingImpact(false)}
            />
            <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="relative w-full max-w-lg bg-surface rounded-3xl p-10 shadow-2xl overflow-hidden"
            >
               <SubmitImpactModal 
                  needId={selectedNeedForImpact.id}
                  itemName={selectedNeedForImpact.item_name}
                  onSuccess={handleImpactSuccess} 
                  onClose={() => setIsSubmittingImpact(false)} 
               />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCreatingNeed && (
          <CreateNeedFlow 
            onClose={() => {
              setIsCreatingNeed(false);
              fetchDashboardData();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
