-- Create verification_provider enum if missing
DO $$ BEGIN
  CREATE TYPE verification_provider AS ENUM ('dojah', 'prembly', 'manual');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Create verifications table for NIN/BVN identity verification
CREATE TABLE IF NOT EXISTS verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  nin_hash VARCHAR(64),
  bvn_hash VARCHAR(64),
  nin_verified_at TIMESTAMPTZ,
  bvn_verified_at TIMESTAMPTZ,
  selfie_url TEXT,
  selfie_match_score DECIMAL(3, 2) CHECK (selfie_match_score >= 0 AND selfie_match_score <= 1.00),
  selfie_matched_at TIMESTAMPTZ,
  provider verification_provider NOT NULL,
  provider_reference VARCHAR(100),
  provider_response_json JSONB,
  verified BOOLEAN DEFAULT FALSE,
  verification_failed BOOLEAN DEFAULT FALSE,
  failure_reason TEXT,
  manual_review_required BOOLEAN DEFAULT FALSE,
  manual_review_completed BOOLEAN DEFAULT FALSE,
  reviewed_by UUID,
  review_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT nin_or_bvn_required CHECK (nin_hash IS NOT NULL OR bvn_hash IS NOT NULL),
  CONSTRAINT verified_requires_hash CHECK (
    (verified = TRUE AND (nin_hash IS NOT NULL OR bvn_hash IS NOT NULL))
    OR verified = FALSE
  )
);

-- Row Level Security
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;

-- Users can read their own verifications
DO $$ BEGIN
  CREATE POLICY "verifications_select_own" ON verifications
    FOR SELECT
    USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Users can insert their own verifications
DO $$ BEGIN
  CREATE POLICY "verifications_insert_own" ON verifications
    FOR INSERT
    WITH CHECK (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Admin access is handled via service role key (bypasses RLS)
