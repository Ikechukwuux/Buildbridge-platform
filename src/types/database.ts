export type UserRole = 'tradesperson' | 'backer' | 'community_leader' | 'admin';

export enum BadgeLevel {
  LEVEL_0_UNVERIFIED = 'level_0_unverified',
  LEVEL_1_COMMUNITY_VOUCHED = 'level_1_community_member',
}

export enum NeedStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  ACTIVE = 'active',
  FUNDED = 'funded',
  COMPLETED = 'completed',
  EXPIRED = 'expired',
  REJECTED = 'rejected',
  FLAGGED = 'flagged',
}

export enum NotificationChannel {
  SMS = 'sms',
  WHATSAPP = 'whatsapp',
  EMAIL = 'email',
}

export type TradeCategory = 'tailor' | 'carpenter' | 'welder' | 'cobbler' | 'food_processor' | 'market_trader' | 'baker' | 'mechanic' | 'electrician' | 'plumber' | 'hair_stylist' | 'blacksmith' | 'other';
export type VerificationProvider = 'dojah' | 'prembly' | 'manual';
export type NotificationType = 'pledge_received' | 'first_pledge_celebration' | 'milestone_50' | 'milestone_80' | 'milestone_100' | 'proof_nudge_day3' | 'proof_nudge_day7' | 'proof_nudge_day14' | 'proof_submitted' | 'zero_pledge_24h' | 'disbursement_complete' | 'vouch_received' | 'need_approved' | 'need_rejected' | 'account_flagged';

export interface User {
  id: string;
  phone: string;
  phone_verified_at: string | null;
  email: string | null;
  email_verified_at: string | null;
  name: string;
  role: UserRole;
  password_hash: string | null;
  last_login_at: string | null;
  last_login_ip: string | null;
  failed_login_attempts: number;
  account_locked_until: string | null;
  two_factor_enabled: boolean;
  is_active: boolean;
  is_suspended: boolean;
  suspension_reason: string | null;
  suspended_at: string | null;
  suspended_by: string | null;
  data_deletion_requested_at: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  trade_category: TradeCategory | null;
  trade_other_description: string | null;
  years_experience: number | null;
  apprentices_trained: number;
  certifications: string[] | null;
  location_lga: string | null;
  location_state: string | null;
  location_latitude: number | null;
  location_longitude: number | null;
  story: string | null;
  photo_url: string | null;
  photo_uploaded_at: string | null;
  badge_level: BadgeLevel;
  badge_updated_at: string | null;
  delivered_count: number;
  vouch_count: number;
  contact_info_visible: boolean;
  pledge_history_visible: boolean;
  notify_via_sms: boolean;
  notify_via_whatsapp: boolean;
  notify_via_email: boolean;
  can_create_needs: boolean;
  created_at: string;
  updated_at: string;
}

export interface Need {
  id: string;
  profile_id: string;
  item_name: string;
  item_cost: number;
  photo_url: string;
  photo_geotag_lat: number | null;
  photo_geotag_lng: number | null;
  photo_uploaded_at: string | null;
  story: string;
  location_state: string | null;
  location_lga: string | null;
  impact_statement: string | null;
  impact_statement_source: string;
  deadline: string;
  created_at: string;
  published_at: string | null;
  completed_at: string | null;
  expired_at: string | null;
  status: NeedStatus;
  moderation_notes: string | null;
  moderated_by: string | null;
  moderated_at: string | null;
  rejection_reason: string | null;
  funded_amount: number;
  pledge_count: number;
  funding_percentage: number;
  disbursed_at: string | null;
  disbursement_amount: number | null;
  disbursement_reference: string | null;
  proof_photo_url: string | null;
  proof_video_url: string | null;
  proof_caption: string | null;
  proof_submitted_at: string | null;
  proof_nudge_count: number;
  last_proof_nudge_at: string | null;
  visibility_boost_until: string | null;
  featured: boolean;
  featured_until: string | null;
  reverse_image_search_flagged: boolean;
  duplicate_detection_flagged: boolean;
  impact_wall_submissions?: any; // Added for relation checking
  updated_at: string;
}

export interface Pledge {
  id: string;
  need_id: string;
  backer_user_id: string;
  amount: number;
  currency: string;
  fee_breakdown_json: {
    platform_fee: number;
    processing_fee: number;
    tradesperson_receives: number;
  };
  payment_provider: string | null;
  payment_reference: string | null;
  payment_status: string;
  paid_at: string | null;
  original_currency: string | null;
  original_amount: number | null;
  exchange_rate: number | null;
  message: string | null;
  contact_revealed_at: string | null;
  disbursed_to_tradesperson: boolean;
  disbursed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Vouch {
  id: string;
  voucher_user_id: string | null;
  voucher_name: string | null;
  voucher_phone: string | null;
  recipient_profile_id: string;
  statement: string;
  created_at: string;
  updated_at: string;
}

export interface Verification {
  id: string;
  profile_id: string;
  nin_hash: string | null;
  bvn_hash: string | null;
  nin_verified_at: string | null;
  bvn_verified_at: string | null;
  selfie_url: string | null;
  selfie_match_score: number | null;
  selfie_matched_at: string | null;
  provider: VerificationProvider;
  provider_reference: string | null;
  provider_response_json: any | null;
  verified: boolean;
  verification_failed: boolean;
  failure_reason: string | null;
  manual_review_required: boolean;
  manual_review_completed: boolean;
  reviewed_by: string | null;
  review_notes: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ImpactWallSubmission {
  id: string;
  need_id: string;
  profile_id: string;
  photo_url: string | null;
  video_url: string | null;
  video_thumbnail_url: string | null;
  caption: string;
  opted_in_at: string;
  public_display_consent: boolean;
  moderation_status: string;
  moderated_by: string | null;
  moderation_notes: string | null;
  moderated_at: string | null;
  published_at: string | null;
  unpublished_at: string | null;
  featured: boolean;
  featured_until: string | null;
  view_count: number;
  share_count: number;
  created_at: string;
  updated_at: string;
}
