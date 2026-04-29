"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { TrustTracker } from "@/components/dashboard/TrustTracker"
import { NINVerificationForm } from "@/components/dashboard/NINVerificationForm"
import { SubmitImpactModal } from "@/components/dashboard/SubmitImpactModal"
import { ProofOfUseModal } from "@/components/dashboard/ProofOfUseModal"
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
  CheckCircle2,
  Trash2,
  PencilLine,
  AlertTriangle,
  Camera
} from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { GoalGradientCard } from "@/components/dashboard/GoalGradientCard"
import { CreateNeedFlow } from "@/components/dashboard/CreateNeedFlow"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"

function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [profile, setProfile] = useState<any>(null)
  const [needs, setNeeds] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isSubmittingImpact, setIsSubmittingImpact] = useState(false)
  const [isSubmittingProof, setIsSubmittingProof] = useState(false)
  const [selectedNeedForImpact, setSelectedNeedForImpact] = useState<any>(null)
  const [selectedNeedForProof, setSelectedNeedForProof] = useState<any>(null)
  const [showCopied, setShowCopied] = useState(false)
  const [userName, setUserName] = useState("Artisan")
  const [isCreatingNeed, setIsCreatingNeed] = useState(false)
  const [needToDelete, setNeedToDelete] = useState<string | null>(null)

  const [deleteError, setDeleteError] = useState<string | null>(null)

  const handleDeleteConfirm = async (id: string) => {
    try {
      setDeleteError(null)
      const { error, count } = await supabase
        .from('needs')
        .delete({ count: 'exact' })
        .eq('id', id)
        .eq('profile_id', profile?.id)

      if (error) {
        console.error("Error deleting need:", error)
        setDeleteError("Failed to delete this need. Please try again.")
        return
      }

      if (count === 0) {
        console.error("Delete returned 0 rows — likely blocked by RLS policy")
        setDeleteError("Unable to delete — you may not have permission. Please contact support.")
        return
      }

      setNeeds(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error("Error deleting need:", error);
      setDeleteError("An unexpected error occurred. Please try again.")
    } finally {
      setNeedToDelete(null);
    }
  }

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
          // If we came from a successful creation but the DB hasn't synced it yet, inject a mock one
          const hasNewSuccessParam = searchParams.get('new_need') === 'success'
          if (hasNewSuccessParam && !needsData.some(n => n.status === 'pending_review')) {
            needsData.unshift({
              id: 'mock-pending-' + Date.now(),
              profile_id: profileData.id,
              item_name: 'New Item Review',
              item_cost: 0,
              funded_amount: 0,
              pledge_count: 0,
              status: 'pending_review',
              photo_url: '',
              story: 'Under review by the BuildBridge team.',
              deadline: new Date().toISOString(),
              created_at: new Date().toISOString()
            })
            // clear the URL param so it doesn't stay stuck
            window.history.replaceState({}, '', '/dashboard')
          }
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
  }, [searchParams])

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

  const profileCompleteness = React.useMemo(() => {
    if (!profile) return 0
    let score = 0
    if (profile.full_name) score += 25
    if (profile.trade_category) score += 25
    if (profile.location_state && profile.location_lga) score += 25
    if (profile.bio) score += 25
    return score
  }, [profile])
  const isProfileComplete = profileCompleteness === 100

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
           {!isProfileComplete ? (
             <GoalGradientCard 
               progress={profileCompleteness}
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
              <h2 className="text-display-small font-black text-on-surface tracking-tight">Your Needs</h2>
              <Link href="/dashboard/needs" className="text-label-large font-bold text-primary flex items-center gap-1 hover:underline">
                View All <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {needs.length > 0 ? (
              <div className="flex flex-col gap-6">
                {/* Success Story Banner */}
                {needs.some(n => n.status === 'completed' && n.proof_submitted_at) && (
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
                        const readyNeed = needs.find(n => n.status === 'completed' && n.proof_submitted_at);
                        setSelectedNeedForImpact(readyNeed);
                        setIsSubmittingImpact(true);
                      }}
                      className="rounded-[1.5rem] px-8 font-black shadow-lg hover:scale-105 transition-all"
                    >
                      Share Story
                    </Button>
                  </div>
                )}

                {/* Proof submission nudge — funded but no proof yet */}
                {needs.some(n => (n.funded_amount || 0) >= n.item_cost && !n.proof_submitted_at && n.item_cost > 0) && (
                  <div className="p-6 bg-amber-500/5 border border-amber-500/30 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-inner">
                        <Camera className="h-6 w-6" />
                      </div>
                      <div className="flex flex-col">
                        <h4 className="text-sm font-black text-on-surface">Your backers are waiting!</h4>
                        <p className="text-xs text-on-surface-variant font-medium">Submit your proof of purchase to complete your funded need.</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => {
                        const proofNeed = needs.find(n => (n.funded_amount || 0) >= n.item_cost && !n.proof_submitted_at && n.item_cost > 0);
                        setSelectedNeedForProof(proofNeed);
                        setIsSubmittingProof(true);
                      }}
                      className="rounded-[1.5rem] px-8 font-black shadow-lg hover:scale-105 transition-all bg-amber-500 text-white hover:bg-amber-500/90 border-none"
                    >
                      Submit Proof
                    </Button>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {needs.map(need => (
                    <NeedCard 
                      key={need.id} 
                      need={{...need, profile}} 
                      isDashboard
                      onClick={() => router.push(`/dashboard/needs/${need.id}`)}
                      onDelete={() => setNeedToDelete(need.id)}
                      onEdit={() => router.push(`/dashboard/needs/${need.id}/edit`)}
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
                <span className="text-3xl font-black text-on-surface tracking-tight">{needs.filter(n => n.status === 'active' || n.status === 'pending_review').length}</span>
                <span className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant/50">Total Needs</span>
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

      <AnimatePresence>
        {deleteError && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-error text-white py-3 px-6 rounded-2xl shadow-2xl font-bold flex items-center gap-2 max-w-md"
            onClick={() => setDeleteError(null)}
          >
            <AlertTriangle className="h-5 w-5 shrink-0" />
            {deleteError}
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
        {isSubmittingProof && selectedNeedForProof && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-on-surface/80 backdrop-blur-md"
               onClick={() => setIsSubmittingProof(false)}
            />
            <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="relative w-full max-w-lg bg-surface rounded-3xl p-8 shadow-2xl overflow-hidden"
            >
               <ProofOfUseModal 
                  needId={selectedNeedForProof.id}
                  itemName={selectedNeedForProof.item_name}
                  onSuccess={() => { fetchDashboardData(); setIsSubmittingProof(false); }}
                  onClose={() => setIsSubmittingProof(false)}
                  onReadyForImpactWall={() => {
                    setSelectedNeedForImpact(selectedNeedForProof);
                    setIsSubmittingImpact(true);
                  }}
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

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {needToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setNeedToDelete(null)} />
             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-surface rounded-3xl p-8 max-w-sm w-full text-center flex flex-col gap-6 shadow-2xl">
                <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto">
                   <Trash2 className="w-8 h-8" />
                </div>
                <div className="flex flex-col gap-2">
                   <h3 className="text-xl font-black text-on-surface">Delete this Need?</h3>
                   <p className="text-sm text-on-surface-variant">This action cannot be undone. Are you sure you want to permanently remove this need?</p>
                </div>
                <div className="flex gap-3 mt-2">
                   <Button variant="outline" className="flex-1 rounded-[1.5rem]" onClick={() => setNeedToDelete(null)}>Cancel</Button>
                   <Button className="flex-1 bg-error text-white hover:bg-error/90 border-none shadow-error/20 rounded-[1.5rem]" onClick={() => handleDeleteConfirm(needToDelete)}>Delete</Button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-background pt-24 pb-20 flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>}>
      <DashboardContent />
    </React.Suspense>
  )
}
