"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Share2, ExternalLink, Quote, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/Badge"
import { type ImpactWallSubmission, type Profile } from "@/types"
import { cn } from "@/lib/utils"

interface ImpactCardProps {
  submission: ImpactWallSubmission & { profile: Profile }
}

export function ImpactCard({ submission }: ImpactCardProps) {
  const { profile, caption, photo_url } = submission

  const badgeLevel = profile.badge_level === 'level_4_platform_verified' ? 4 
    : profile.badge_level === 'level_3_established' ? 3 
    : profile.badge_level === 'level_2_trusted_tradesperson' ? 2 
    : profile.badge_level === 'level_1_community_member' ? 1 : 0;

  const profileName = (profile as any).name || "Verified Artisan"
  const profilePhoto = profile.photo_url || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23e9ddff' width='100' height='100'/%3E%3Ctext x='50' y='55' text-anchor='middle' dominant-baseline='middle' font-family='sans-serif' font-size='40' font-weight='bold' fill='%236750A4'%3E${profileName.charAt(0)}%3C/text%3E%3C/svg%3E`

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="group relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-surface-variant/20 border border-outline-variant/30 shadow-lg hover:shadow-2xl transition-shadow duration-500"
    >
      {/* Background Media */}
      <div className="absolute inset-0">
        <img 
          src={photo_url || "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=800"} 
          alt={caption} 
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
      </div>

      {/* Profile & Badge (Top Left) */}
      <div className="absolute top-5 left-5 flex items-center gap-3">
         <div className="h-11 w-11 rounded-full border-2 border-white/60 overflow-hidden bg-surface shadow-md">
            <img src={profilePhoto} alt={profileName} className="h-full w-full object-cover" />
         </div>
         <div className="flex flex-col">
           <span className="text-sm font-black text-white drop-shadow-sm">{profileName}</span>
           <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider">{profile.trade_category?.replace('_', ' ')}</span>
         </div>
      </div>

      {/* Badge (Top Right) */}
      <div className="absolute top-5 right-5">
        <Badge level={badgeLevel as any} className="shadow-lg" />
      </div>

      {/* Content Overlay (Bottom) */}
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 flex flex-col gap-4">
        
        <div className="flex flex-col gap-2">
           <p className="text-[10px] uppercase font-black text-yellow-400 tracking-widest flex items-center gap-1.5">
              <Quote className="h-3 w-3" />
              Impact Story
           </p>
           <h3 className="text-xl md:text-2xl text-white font-black leading-tight line-clamp-3">
              &ldquo;{caption}&rdquo;
           </h3>
        </div>

        {/* Location & Actions */}
        <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/10">
           <div className="flex items-center gap-1.5">
             <MapPin className="h-3.5 w-3.5 text-white/50" />
             <span className="text-xs font-bold text-white/60">
                {(profile as any).location_lga}, {(profile as any).location_state}
             </span>
           </div>
           
           <div className="flex gap-2">
              <button className="h-9 w-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all">
                 <Share2 className="h-4 w-4" />
              </button>
              <button className="h-9 px-4 rounded-full bg-white text-on-surface font-black text-xs flex items-center gap-1.5 hover:bg-primary hover:text-white transition-all">
                 View Story
                 <ExternalLink className="h-3.5 w-3.5" />
              </button>
           </div>
        </div>
      </div>
    </motion.div>
  )
}
