/**
 * Trust badge derivation — Section 04 of the technical brief.
 *
 * Four independent achievements (not a ladder):
 *   1. ID Verified       — BVN/NIN check passes
 *   2. Trade Verified    — portfolio approved by admin (proxied by community-vouched level)
 *   3. Campaign Active   — at least one approved/live need
 *   4. BuildBridge Verified — completed at least one funded need with approved proof
 *
 * Pure function: pass in only the data you have. Anything missing is treated
 * as "not earned".
 */

export type TrustBadgeKey =
  | "id_verified"
  | "trade_verified"
  | "campaign_active"
  | "build_bridge_verified"

export interface TrustBadgeInputs {
  /** Output of `verifications` table for this profile, if loaded. */
  verification?: { verified?: boolean | null } | null
  /** The profile row (we use badge_level + delivered_count + verification flag). */
  profile?: {
    badge_level?: string | null
    delivered_count?: number | null
  } | null
  /** Needs belonging to this profile (any status). */
  needs?: Array<{ status?: string | null; proof_submitted_at?: string | null }> | null
}

export interface DerivedTrustBadges {
  id_verified: boolean
  trade_verified: boolean
  campaign_active: boolean
  build_bridge_verified: boolean
}

export function deriveTrustBadges(inputs: TrustBadgeInputs): DerivedTrustBadges {
  const idVerified = Boolean(inputs.verification?.verified)

  // Trade Verified uses community-vouched badge_level as the proxy until a
  // dedicated portfolio review flag exists.
  const tradeVerified =
    !!inputs.profile?.badge_level &&
    inputs.profile.badge_level !== "level_0_unverified"

  const needs = inputs.needs || []
  const campaignActive = needs.some(n => n.status === "active" || n.status === "funded")

  // BuildBridge Verified: at least one completed need with proof submitted,
  // OR profile.delivered_count > 0 (cached fast path).
  const buildBridgeVerified =
    (inputs.profile?.delivered_count || 0) > 0 ||
    needs.some(n => n.status === "completed" && !!n.proof_submitted_at)

  return {
    id_verified: idVerified,
    trade_verified: tradeVerified,
    campaign_active: campaignActive,
    build_bridge_verified: buildBridgeVerified,
  }
}

export const TRUST_BADGE_META: Record<
  TrustBadgeKey,
  { label: string; description: string }
> = {
  id_verified: {
    label: "ID Verified",
    description: "Government ID checked and confirmed.",
  },
  trade_verified: {
    label: "Trade Verified",
    description: "Portfolio reviewed and approved.",
  },
  campaign_active: {
    label: "Campaign Active",
    description: "Has at least one live funding need.",
  },
  build_bridge_verified: {
    label: "BuildBridge Verified",
    description: "Completed a funded need with approved proof.",
  },
}
