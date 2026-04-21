"use client"

import * as React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, MapPin, Calendar, Users, Clock, Sparkles, Share2, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/Badge"
import { type ImpactStory } from "@/lib/impact-stories"

interface StoryDetailProps {
  story: ImpactStory
}

export function StoryDetail({ story }: StoryDetailProps) {
  const badgeLevel = story.profile.badge_level === 'level_4_platform_verified' ? 4 
    : story.profile.badge_level === 'level_3_established' ? 3 
    : story.profile.badge_level === 'level_2_trusted_tradesperson' ? 2 
    : story.profile.badge_level === 'level_1_community_member' ? 1 : 0;

  const profilePhoto = story.profile.photo_url || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23e9ddff' width='100' height='100'/%3E%3Ctext x='50' y='55' text-anchor='middle' dominant-baseline='middle' font-family='sans-serif' font-size='40' font-weight='bold' fill='%236750A4'%3E${story.profile.name.charAt(0)}%3C/text%3E%3C/svg%3E`

  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden">
      
      {/* Hero Cover Image */}
      <section className="relative h-[60vh] min-h-[400px] max-h-[600px] overflow-hidden">
        <img 
          src={story.photo_url} 
          alt={story.title} 
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

        {/* Back button */}
        <div className="absolute top-28 left-4 sm:left-8 z-20">
          <Link 
            href="/impact"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold hover:bg-white/20 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Impact Wall
          </Link>
        </div>

        {/* Hero Content */}
        <div className="absolute inset-x-0 bottom-0 z-10">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-12">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-4"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400 text-black text-[10px] font-black uppercase tracking-widest w-fit">
                <Sparkles className="h-3 w-3" />
                Impact Story
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight max-w-3xl">
                {story.title}
              </h1>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="relative" style={{ background: 'var(--color-surface)' }}>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
          
          {/* Author Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-[2rem] p-6 md:p-8 shadow-xl border border-outline-variant/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-md">
                <img src={profilePhoto} alt={story.profile.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-black" style={{ color: 'var(--color-on-surface)' }}>{story.profile.name}</span>
                  <Badge level={badgeLevel as any} />
                </div>
                <div className="flex items-center gap-3 text-xs font-bold" style={{ color: 'var(--color-on-surface-variant)' }}>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {story.profile.location_lga}, {story.profile.location_state}
                  </span>
                  <span>·</span>
                  <span className="uppercase tracking-wider">{story.profile.trade_category.replace('_', ' ')}</span>
                  <span>·</span>
                  <span>{story.profile.years_experience}yrs experience</span>
                </div>
              </div>
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-outline-variant/30 text-sm font-bold hover:border-primary/30 hover:bg-primary/5 transition-all" style={{ color: 'var(--color-on-surface-variant)' }}>
              <Share2 className="h-4 w-4" />
              Share Story
            </button>
          </motion.div>

          {/* Stats Strip */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
          >
            {[
              { icon: Sparkles, value: story.stats.funded_amount, label: "Funded" },
              { icon: Users, value: story.stats.backers.toString(), label: "Backers" },
              { icon: Clock, value: `${story.stats.days_to_fund} days`, label: "To Fund" },
              { icon: Calendar, value: story.stats.item_funded, label: "Equipment" },
            ].map((stat, i) => (
              <div 
                key={i} 
                className="flex flex-col gap-2 p-5 rounded-2xl"
                style={{ background: 'var(--color-surface-container)' }}
              >
                <stat.icon className="h-5 w-5" style={{ color: 'var(--color-primary)' }} />
                <span className="text-lg font-black" style={{ color: 'var(--color-on-surface)' }}>{stat.value}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--color-on-surface-variant)' }}>{stat.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Article Body */}
          <motion.article 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 flex flex-col gap-8"
          >
            {story.content.map((paragraph, i) => (
              <React.Fragment key={i}>
                <p className="text-lg leading-relaxed font-medium" style={{ color: 'var(--color-on-surface)', opacity: 0.85 }}>
                  {paragraph}
                </p>
                {/* Insert gallery image after 2nd paragraph */}
                {i === 1 && story.gallery.length > 1 && (
                  <div className="rounded-2xl overflow-hidden shadow-lg my-4">
                    <img 
                      src={story.gallery[1]} 
                      alt={`${story.profile.name}'s work`}
                      className="w-full h-auto object-cover max-h-[400px]"
                    />
                  </div>
                )}
                {/* Insert gallery image after 4th paragraph */}
                {i === 3 && story.gallery.length > 2 && (
                  <div className="rounded-2xl overflow-hidden shadow-lg my-4">
                    <img 
                      src={story.gallery[2]} 
                      alt={`${story.profile.name}'s journey`}
                      className="w-full h-auto object-cover max-h-[400px]"
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </motion.article>

          {/* Bottom Navigation */}
          <div className="mt-16 mb-24 pt-12 border-t flex flex-col sm:flex-row items-center justify-between gap-6" style={{ borderColor: 'var(--color-outline-variant)' }}>
            <Link 
              href="/impact"
              className="inline-flex items-center gap-2 text-sm font-bold hover:text-primary transition-colors" 
              style={{ color: 'var(--color-on-surface-variant)' }}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Impact Wall
            </Link>
            <Link 
              href="/browse"
              className="inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-3.5 rounded-full text-base font-black tracking-wide shadow-lg hover:shadow-xl transition-all"
            >
              Back a Tradesperson
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
