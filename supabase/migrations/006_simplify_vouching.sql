-- ============================================================================
-- BuildBridge Migration 006: Create Vouches Table (Simplified)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Create vouches table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vouches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voucher_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  recipient_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  statement TEXT NOT NULL CHECK (char_length(statement) >= 20 AND char_length(statement) <= 300),
  voucher_name TEXT,
  voucher_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2. Enable RLS
-- ----------------------------------------------------------------------------
ALTER TABLE vouches ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (safe re-run)
DROP POLICY IF EXISTS "vouches_select_all" ON vouches;

-- Anyone can read vouches (public visibility)
CREATE POLICY "vouches_select_all" ON vouches
  FOR SELECT USING (true);

-- No insert policy — insert is handled by server action using service_role key

-- ----------------------------------------------------------------------------
-- 3. Ensure profiles has vouch_count (add if missing)
-- ----------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'vouch_count'
  ) THEN
    ALTER TABLE profiles ADD COLUMN vouch_count INTEGER DEFAULT 0;
  END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 4. Drop obsolete tables if they exist from prior experiments
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS vouch_velocity_tracking CASCADE;
DROP TABLE IF EXISTS community_leader_endorsements CASCADE;
DROP TABLE IF EXISTS fraud_detection_events CASCADE;

-- ----------------------------------------------------------------------------
-- 5. Clean up any obsolete columns on profiles (if they exist from prior experiments)
-- ----------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'trust_score') THEN
    ALTER TABLE profiles DROP COLUMN trust_score;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'fraud_flags') THEN
    ALTER TABLE profiles DROP COLUMN fraud_flags;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'last_fraud_review_at') THEN
    ALTER TABLE profiles DROP COLUMN last_fraud_review_at;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'can_vouch') THEN
    ALTER TABLE profiles DROP COLUMN can_vouch;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'vouching_suspended_until') THEN
    ALTER TABLE profiles DROP COLUMN vouching_suspended_until;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'vouch_details_visible') THEN
    ALTER TABLE profiles DROP COLUMN vouch_details_visible;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'income_visible') THEN
    ALTER TABLE profiles DROP COLUMN income_visible;
  END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 6. Drop unused enums (safe — only if they exist)
-- ----------------------------------------------------------------------------
DROP TYPE IF EXISTS relationship_type CASCADE;
