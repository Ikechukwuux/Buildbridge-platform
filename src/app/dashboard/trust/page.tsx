"use client"

import * as React from "react"
import { BadgeDisplay } from "@/components/ui/BadgeDisplay"
import { TrustTracker } from "@/components/dashboard/TrustTracker"
import { PremiumPageLayout } from "@/components/layout/PremiumPageLayout"
import { ShieldCheck, Award, Users2, CheckCircle2, FileCheck, Handshake } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

function TrustPageContent() {
  const supabase = createClient()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const badgeEnumMapping: any = {
    'level_0_unverified': 0,
    'level_1_community_member': 1,
    'level_2_trusted_tradesperson': 2,
    'level_3_established': 3,
    'level_4_platform_verified': 4
  }

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle()
        setProfile(data)
      }
      setLoading(false)
    }
    fetchProfile()
  }, [supabase])

  const handleVouchRequest = () => {
    if (!profile?.id) return
    const vouchUrl = `${window.location.origin}/profile/${profile.id}/vouch`
    navigator.clipboard.writeText(vouchUrl)
  }

  const levels = [
    {
      level: 0,
      title: "Unverified",
      color: "bg-surface-variant",
      textColor: "text-on-surface",
      borderColor: "border-outline-variant",
      icon: Users2,
      requirements: "Account created",
      description: "Your account is set up and ready. Complete your profile to begin building trust."
    },
    {
      level: 1,
      title: "Community Member",
      color: "bg-blue-500",
      textColor: "text-white",
      borderColor: "border-blue-600",
      icon: Handshake,
      requirements: "Profile completed + Government ID verified",
      description: "You're a verified community member with a completed profile. You can create needs and receive vouches."
    },
    {
      level: 2,
      title: "Trusted Tradesperson",
      color: "bg-green-500",
      textColor: "text-white",
      borderColor: "border-green-600",
      icon: CheckCircle2,
      requirements: "3+ vouches from verified users",
      description: "You've received vouches from your community. Backers can now fund your needs with confidence."
    },
    {
      level: 3,
      title: "Established",
      color: "bg-amber-500",
      textColor: "text-white",
      borderColor: "border-amber-600",
      icon: Award,
      requirements: "2+ successfully funded needs completed",
      description: "You've delivered on your commitments. Your reputation is solid and searchable."
    },
    {
      level: 4,
      title: "Platform Verified",
      color: "bg-primary",
      textColor: "text-white",
      borderColor: "border-primary",
      icon: ShieldCheck,
      requirements: "Field verification + document review",
      description: "Highest trust level. Your identity and trade have been verified by BuildBridge. You appear in featured listings."
    }
  ]

  if (loading) {
    return (
      <div className="w-full flex flex-col gap-8 animate-pulse">
        <div className="h-48 bg-surface-variant/30 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-surface-variant/30 rounded-3xl" />
          <div className="h-64 bg-surface-variant/30 rounded-3xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-10 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl md:text-5xl font-black text-on-surface tracking-tight">
            Trust & <span className="text-primary italic">Badges</span>
          </h1>
          <p className="text-body-large text-on-surface-variant max-w-xl">
            Learn how trust levels work and track your reputation journey on BuildBridge.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 flex flex-col gap-8">
          <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/10">
            <h2 className="text-2xl font-black text-on-surface tracking-tight mb-6">
              The 5 Trust Levels
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {levels.map((lvl, index) => (
                <motion.div
                  key={lvl.level}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 rounded-2xl border-2 ${lvl.borderColor} ${lvl.color} flex flex-col gap-3`}
                >
                  <div className={`w-10 h-10 rounded-xl ${lvl.color} flex items-center justify-center`}>
                    <lvl.icon className={`h-5 w-5 ${lvl.textColor}`} />
                  </div>
                  <div>
                    <h3 className={`text-lg font-black ${lvl.textColor}`}>
                      {lvl.level === 0 ? '0' : lvl.level}: {lvl.title}
                    </h3>
                    <p className={`text-xs font-bold ${lvl.textColor} opacity-80 mt-1`}>
                      {lvl.requirements}
                    </p>
                    <p className={`text-sm ${lvl.textColor} mt-3 opacity-90`}>
                      {lvl.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <BadgeDisplay />
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24 h-fit">
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-black text-on-surface-variant uppercase tracking-widest pl-2">
              Your Reputation
            </h3>
            <div className="p-1 rounded-[2.5rem] bg-surface border border-outline-variant/30 shadow-sm">
              <TrustTracker
                currentLevel={badgeEnumMapping[profile?.badge_level || 'level_0_unverified']}
                vouches={profile?.vouch_count || 0}
                deliveries={profile?.delivered_count || 0}
                onVerifyClick={() => {}}
                onVouchRequest={handleVouchRequest}
              />
            </div>
          </div>

          <div className="p-8 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/10 rounded-[2.5rem]">
            <h3 className="text-lg font-black text-on-surface tracking-tight mb-4">
              How to Level Up
            </h3>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <FileCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-on-surface-variant">
                  Complete your profile with accurate information
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Users2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-on-surface-variant">
                  Get vouched by verified community members
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-on-surface-variant">
                  Complete funded needs and share proof of use
                </span>
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-on-surface-variant">
                  Pass field verification for top tier
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TrustPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-background pt-24 pb-20 flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>}>
      <TrustPageContent />
    </React.Suspense>
  )
}