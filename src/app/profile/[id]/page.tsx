import { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { MapPin, Briefcase, Award, Calendar, ChevronLeft, Share2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { NeedCard } from "@/components/ui/NeedCard"
import { TrustBadges } from "@/components/ui/TrustBadges"
import { deriveTrustBadges } from "@/lib/trust-badges"
import { ShareButton } from "@/components/ui/ShareButton"
import { formatStateName } from "@/lib/utils"
import { TRADE_ICONS_MAP } from "@/lib/constants"

interface ProfilePageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, trade_category, location_state")
    .eq("id", id)
    .single()

  if (!profile) return { title: "Artisan Profile | BuildBridge" }

  const trade = profile.trade_category?.replace(/_/g, " ")
  const state = formatStateName(profile.location_state)
  return {
    title: `${profile.full_name} — ${trade} in ${state} | BuildBridge`,
    description: `Support ${profile.full_name}'s equipment needs on BuildBridge. Verified artisan based in ${state}.`,
  }
}

export default async function ArtisanProfilePage({ params }: ProfilePageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single()

  if (profileError || !profile) notFound()

  const [{ data: needs }, { data: verification }] = await Promise.all([
    supabase
      .from("needs")
      .select("*")
      .eq("profile_id", id)
      .in("status", ["active", "funded", "completed"])
      .order("created_at", { ascending: false }),
    supabase
      .from("verifications")
      .select("verified")
      .eq("profile_id", id)
      .maybeSingle(),
  ])

  const activeNeeds = (needs || []).filter(n => n.status === "active" || n.status === "funded")
  const pastNeeds = (needs || []).filter(n => n.status === "completed")

  const badges = deriveTrustBadges({
    profile,
    needs: needs || [],
    verification: verification || null,
  })

  const TradeIcon = (profile.trade_category && TRADE_ICONS_MAP[profile.trade_category]) || Briefcase
  const tradeName = profile.trade_category?.replace(/_/g, " ") || "Tradesperson"
  const stateName = formatStateName(profile.location_state)
  const locationStr = [profile.location_lga, stateName].filter(Boolean).join(", ")

  const profileNeedShape = {
    full_name: profile.full_name,
    name: profile.full_name,
    trade_category: profile.trade_category,
    location_lga: profile.location_lga,
    location_state: profile.location_state,
    badge_level: profile.badge_level,
    photo_url: profile.photo_url,
    vouch_count: profile.vouch_count,
  }

  return (
    <main className="min-h-screen bg-background pt-24 pb-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex flex-col gap-10">

        {/* Nav */}
        <div className="flex items-center justify-between">
          <Link href="/browse" className="flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">
            <ChevronLeft className="h-5 w-5" />
            Browse needs
          </Link>
          <ShareButton
            title={`Support ${profile.full_name} on BuildBridge`}
            text={`${profile.full_name} is a ${tradeName} in ${stateName}. Check out their needs on BuildBridge!`}
            url={`/profile/${id}`}
            className="rounded-full"
          />
        </div>

        {/* Profile hero */}
        <div className="rounded-[2.5rem] bg-white border border-outline-variant/30 shadow-sm overflow-hidden">
          {/* Top accent band */}
          <div className="h-24 bg-gradient-to-r from-primary/30 via-primary/20 to-tertiary/20 relative">
            <div className="absolute -bottom-10 left-8">
              <div className="relative h-20 w-20 rounded-[1.5rem] border-4 border-white shadow-xl overflow-hidden bg-primary/10">
                {profile.photo_url ? (
                  <Image
                    src={profile.photo_url}
                    alt={profile.full_name || "Artisan"}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-black text-primary">
                      {(profile.full_name || "A").charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-14 pb-8 px-8 flex flex-col gap-5">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl md:text-4xl font-black text-on-surface tracking-tight">
                  {profile.full_name || "Artisan"}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-on-surface-variant">
                  <span className="inline-flex items-center gap-1.5">
                    <TradeIcon className="h-4 w-4 text-primary" />
                    <span className="capitalize">{tradeName}</span>
                  </span>
                  {locationStr && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {locationStr}
                    </span>
                  )}
                  {profile.years_experience && (
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {profile.years_experience} yrs experience
                    </span>
                  )}
                  {(profile.delivered_count || 0) > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <Award className="h-3.5 w-3.5 text-amber-600" />
                      {profile.delivered_count} completed need{profile.delivered_count !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>

              {/* Quick stats */}
              <div className="flex gap-6 shrink-0">
                <div className="text-center">
                  <p className="text-2xl font-black text-on-surface">{profile.vouch_count || 0}</p>
                  <p className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant/60">Vouches</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-on-surface">{activeNeeds.length}</p>
                  <p className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant/60">Active</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-on-surface">{pastNeeds.length}</p>
                  <p className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant/60">Completed</p>
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <TrustBadges badges={badges} showLocked={false} size="sm" />

            {/* Bio */}
            {profile.bio && (
              <p className="text-base font-medium text-on-surface-variant leading-relaxed max-w-2xl">
                {profile.bio}
              </p>
            )}
          </div>
        </div>

        {/* Active needs */}
        {activeNeeds.length > 0 && (
          <section className="flex flex-col gap-6">
            <h2 className="text-2xl font-black text-on-surface tracking-tight">Active Needs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {activeNeeds.map(n => (
                <NeedCard key={n.id} need={{ ...n, profile: profileNeedShape }} />
              ))}
            </div>
          </section>
        )}

        {/* Past needs */}
        {pastNeeds.length > 0 && (
          <section className="flex flex-col gap-6">
            <h2 className="text-2xl font-black text-on-surface tracking-tight">Completed Needs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {pastNeeds.map(n => (
                <NeedCard key={n.id} need={{ ...n, profile: profileNeedShape }} />
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {activeNeeds.length === 0 && pastNeeds.length === 0 && (
          <div className="text-center py-16 text-on-surface-variant font-medium">
            No active needs at the moment. Check back soon.
          </div>
        )}

        {/* Vouch CTA */}
        <div className="rounded-[2rem] p-8 md:p-10 bg-primary/5 border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-black text-on-surface tracking-tight">
              Know {profile.full_name?.split(" ")[0] || "this artisan"}?
            </h3>
            <p className="text-sm font-medium text-on-surface-variant max-w-md">
              If you've worked with or bought from them, your vouch helps grow their trust score and unlocks higher funding tiers.
            </p>
          </div>
          <Link
            href={`/profile/${id}/vouch`}
            className="shrink-0 h-12 px-8 rounded-full bg-primary text-on-primary font-black text-sm uppercase tracking-widest hover:-translate-y-0.5 transition-transform shadow-lg flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Vouch for them
          </Link>
        </div>
      </div>
    </main>
  )
}
