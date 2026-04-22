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
  const [authRetryCount, setAuthRetryCount] = useState(0)
  const [isCreatingNeed, setIsCreatingNeed] = useState(false)
  const MAX_AUTH_RETRIES = 3

  const fetchDashboardData = async () => {
    setLoading(true)

    // Bypass auth in development mode for UI testing
    if (process.env.NODE_ENV === 'development') {
      console.warn("Dev mode: bypassing client auth check to allow UI testing.");
      setUserName("Demo Artisan");
      setProfile({
        full_name: "Demo Artisan",
        badge_level: 'level_3_established',
        vouch_count: 12,
        delivered_count: 45,
        id: "demo-123"
      });
      setNeeds([
        {
          id: "demo-need-1",
          item_name: "Industrial Sewing Machine",
          item_cost: 35000000,
          funded_amount: 21500000,
          pledge_count: 5,
          status: 'active',
          deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString(),
          photo_url: "/images/hero/tailor.png",
          story: "I need an overlock machine to take on more uniform contracts for local schools.",
          profile: {
            id: "demo-123",
            name: "Demo Artisan",
            location_lga: "Surulere",
            location_state: "Lagos",
            trade_category: "tailor",
            badge_level: "level_3_established",
            vouch_count: 12,
            photo_url: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=200",
          }
        }
      ]);
      setLoading(false);
      return;
    }

    try {
      // 1. Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()

      if (userError || !user) {
        console.error('Dashboard auth check failed:', { userError, user })
        if (authRetryCount < MAX_AUTH_RETRIES) {
          setAuthRetryCount(prev => prev + 1)
          setTimeout(() => {
            fetchDashboardData()
          }, 1000)
          return
        } else {
          // Not authenticated - redirect to login
          router.push(`/login?redirectTo=/dashboard`)
          return
        }
      }
      setAuthRetryCount(0)
      console.log('Dashboard auth check passed:', user.id)

      // Get display name from user metadata
      const fullName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Artisan"
      setUserName(fullName)

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
    <div className="flex flex-col gap-8 pb-10">

      {/* ── Top Bar (Inspired by reference) ── */}
      <DashboardHeader
        userName={userName}
        avatarLetter={userName.charAt(0).toUpperCase()}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* ── LEFT COLUMN (Wide) ── */}
        <div className="lg:col-span-8 flex flex-col gap-10">

          {/* Feature Banner / Next Milestone */}
          {needs.length === 0 ? (
            <GoalGradientCard
              progress={20}
              onAction={() => setIsCreatingNeed(true)}
            />
          ) : (
            <div className="relative overflow-hidden p-10 rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/10 group">
              <div className="absolute top-0 right-0 p-8 opacity-10 -rotate-12">
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
                <div className="mt-4 flex gap-4">
                  <button
                    onClick={() => window.location.href = '/dashboard/needs'}
                    className="h-12 px-6 rounded-xl bg-primary text-white font-black text-sm shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    Manage Needs
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Stats Strip (Inspired by reference stats row) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Active Needs", value: needs.filter(n => n.status === 'active').length, icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
              { label: "Total Backers", value: totalBackers, icon: Users, color: "text-badge-3", bg: "bg-badge-3/10" },
              { label: "Trust Score", value: `${(badgeEnumMapping[profile?.badge_level || 'level_0_unverified'] + 1) * 20}%`, icon: ShieldCheck, color: "text-badge-2", bg: "bg-badge-2/10" }
            ].map((stat, i) => (
              <div key={i} className="p-6 rounded-[2rem] bg-surface border border-outline-variant/30 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", stat.bg, stat.color)}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-on-surface">{stat.value}</span>
                  <span className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant/50">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Active Needs Section */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-on-surface tracking-tight">Your Active Needs</h2>
              <Link href="/dashboard/needs" className="text-sm font-black text-primary flex items-center gap-1 hover:underline">
                See all <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {needs.length > 0 ? (
              <div className="flex flex-col gap-6">
                {/* Success Story Banner */}
                {needs.some(n => n.status === 'completed') && (
                  <div className="p-6 bg-primary/5 border border-primary/20 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
                        <Sparkles className="h-6 w-6" />
                      </div>
                      <div className="flex flex-col">
                        <h4 className="text-sm font-black text-on-surface">Share your success stories!</h4>
                        <p className="text-xs text-on-surface-variant">You have funded needs ready for the Impact Wall.</p>
                      </div>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        const readyNeed = needs.find(n => n.status === 'completed');
                        setSelectedNeedForImpact(readyNeed);
                        setIsSubmittingImpact(true);
                      }}
                      className="rounded-xl px-6"
                    >
                      Share Story
                    </Button>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {needs.map(need => (
                    <NeedCard
                      key={need.id}
                      need={{ ...need, profile }}
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
                onAction={() => window.location.href = '/create-need?mode=create'}
              />
            )}
          </div>

          {/* Badge Display Area (Integrated at bottom of left column) */}
          <div className="pt-8 border-t border-outline-variant">
            <BadgeDisplay />
          </div>
        </div>

        {/* ── RIGHT COLUMN (Narrow) ── */}
        <div className="lg:col-span-4 flex flex-col gap-8">

          {/* Trust Tracking Sidebar Card */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-black text-on-surface-variant uppercase tracking-widest pl-2">
              Reputation Progress
            </h3>
            <TrustTracker
              currentLevel={badgeEnumMapping[profile?.badge_level || 'level_0_unverified']}
              vouches={profile?.vouch_count || 0}
              deliveries={profile?.delivered_count || 0}
              onVerifyClick={() => setIsVerifying(true)}
              onVouchRequest={handleVouchRequest}
            />
          </div>

          {/* Impact Snapshot */}
          <div className="p-8 bg-surface border border-outline-variant shadow-sm rounded-[2.5rem] flex flex-col gap-6">
            <h3 className="text-xs font-black text-on-surface uppercase tracking-[0.2em] opacity-40">
              Impact History
            </h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between p-4 bg-surface-variant/10 rounded-2xl border border-white/50">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-badge-2" />
                  <span className="text-sm font-bold">Funds Raised</span>
                </div>
                <span className="text-lg font-black">
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                    maximumFractionDigits: 0,
                  }).format(totalFunded)}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-surface-variant/10 rounded-2xl border border-white/50">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-badge-3" />
                  <span className="text-sm font-bold">Total Backers</span>
                </div>
                <span className="text-lg font-black">{totalBackers}</span>
              </div>
            </div>
          </div>

          {/* Trust Engine / Quick Action */}
          <div className="p-8 bg-on-surface text-surface rounded-[2.5rem] flex flex-col gap-6 shadow-2xl shadow-on-surface/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 -rotate-12 group-hover:rotate-0 transition-transform">
              <ShieldCheck className="w-20 h-20" />
            </div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-black">Trust Engine</h3>
            </div>
            <p className="text-sm opacity-80 leading-relaxed font-medium relative z-10">
              Verified artisans are funded <span className="text-primary font-black">4x faster</span>. Complete your NIN verification now.
            </p>
            <Button
              onClick={() => setIsVerifying(true)}
              className="w-full h-14 rounded-2xl gap-2 font-black text-on-surface bg-white hover:bg-white/90 border-none transition-all relative z-10 shadow-xl"
            >
              Verify NIN
            </Button>
          </div>

          {/* New Shortcut to Create Need */}
          <button
            onClick={() => window.location.href = '/create-need?mode=create'}
            className="group p-8 rounded-[2.5rem] border-2 border-dashed border-outline-variant hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-4 text-center"
          >
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Plus className="w-8 h-8" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black text-on-surface">New Funding Request</span>
              <span className="text-xs font-bold text-on-surface-variant/60">Bridge your next business milestone</span>
            </div>
          </button>

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
              className="relative w-full max-w-lg bg-surface rounded-[2.5rem] p-10 shadow-2xl overflow-hidden"
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
              className="relative w-full max-w-lg bg-surface rounded-[2.5rem] p-10 shadow-2xl overflow-hidden"
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
