"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { NeedCard, NeedCardSkeleton } from "@/components/ui/NeedCard"
import { EmptyState } from "@/components/ui/EmptyState"
import { Sparkles, ListChecks } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export default function DashboardNeedsPage() {
  const supabase = createClient()
  const [needs, setNeeds] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "active" | "funded" | "completed">("all")

  useEffect(() => {
    const fetchNeeds = async () => {
      setLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle()

        if (profileData) {
          setProfile(profileData)
          const { data: needsData } = await supabase
            .from('needs')
            .select('*')
            .eq('profile_id', profileData.id)
            .order('created_at', { ascending: false })

          if (needsData) {
            setNeeds(needsData)
          }
        }
      } catch (err) {
        console.error("Error fetching needs:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchNeeds()
  }, [supabase])

  const filteredNeeds = needs.filter(need => {
    if (filter === "all") return true
    if (filter === "active") return need.status === "active" && (need.funded_amount / need.item_cost) < 1
    if (filter === "funded") return (need.funded_amount / need.item_cost) >= 1 && need.status !== "completed"
    if (filter === "completed") return need.status === "completed"
    return true
  })

  return (
    <div className="flex flex-col gap-10 pb-10">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
         <h1 className="text-4xl md:text-5xl font-black text-on-surface tracking-tight flex items-center gap-4">
            <ListChecks className="w-10 h-10 text-primary" />
            Your <span className="text-primary italic">Needs.</span>
         </h1>
        <p className="text-body-large text-on-surface-variant max-w-xl">
           Track all your funding requests, update backers, and manage your goals.
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { id: "all", label: "All Needs" },
          { id: "active", label: "Active" },
          { id: "funded", label: "Fully Funded" },
          { id: "completed", label: "Completed" }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={cn(
              "px-6 py-3 rounded-full text-sm font-black uppercase tracking-widest transition-all whitespace-nowrap",
              filter === tab.id 
                ? "bg-primary text-white shadow-xl shadow-primary/20" 
                : "bg-surface border border-outline-variant text-on-surface-variant hover:border-primary/50"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <NeedCardSkeleton key={i} />)}
        </div>
      ) : filteredNeeds.length > 0 ? (
        <AnimatePresence mode="popLayout">
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNeeds.map(need => (
              <motion.div
                key={need.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <NeedCard 
                  need={{...need, profile}} 
                  isDashboard
                  onClick={() => window.location.href = `/dashboard/needs/${need.id}`}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      ) : (
        <EmptyState 
           icon={Sparkles}
           title="No needs found"
           description={
             filter === "all" 
               ? "You haven't created any funding requests yet." 
               : `You have no ${filter} requests.`
           }
           actionLabel="Create a Need"
           onAction={() => window.location.href = '/dashboard/create-need'}
        />
      )}
    </div>
  )
}
