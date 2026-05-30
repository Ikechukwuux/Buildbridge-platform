-- ============================================================================
-- BuildBridge Migration 008: Production Fixes
-- Run in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ============================================================================

SET search_path TO public;

-- ----------------------------------------------------------------------------
-- 1. Create pledges table
--    References public.needs and auth.users. backer_user_id is nullable
--    so anonymous donors (no account) are supported.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pledges (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  need_id                   UUID NOT NULL REFERENCES public.needs(id) ON DELETE CASCADE,
  backer_user_id            UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  amount                    DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
  currency                  VARCHAR(3) DEFAULT 'NGN',
  fee_breakdown_json        JSONB NOT NULL DEFAULT '{}',
  payment_provider          VARCHAR(20),
  payment_reference         VARCHAR(100) UNIQUE,
  payment_status            VARCHAR(20) DEFAULT 'pending',
  paid_at                   TIMESTAMPTZ,
  message                   TEXT CHECK (char_length(message) <= 500),
  disbursed_to_tradesperson BOOLEAN DEFAULT FALSE,
  disbursed_at              TIMESTAMPTZ,
  created_at                TIMESTAMPTZ DEFAULT NOW(),
  updated_at                TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.pledges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pledges_select_own" ON public.pledges;
CREATE POLICY "pledges_select_own" ON public.pledges
  FOR SELECT USING (backer_user_id = auth.uid());

DROP POLICY IF EXISTS "pledges_select_recipient" ON public.pledges;
CREATE POLICY "pledges_select_recipient" ON public.pledges
  FOR SELECT USING (
    need_id IN (
      SELECT n.id FROM public.needs n
      JOIN public.profiles p ON n.profile_id = p.id
      WHERE p.user_id = auth.uid()
    )
  );

-- ----------------------------------------------------------------------------
-- 2. Bank account fields on profiles (required for Paystack Transfer payout)
-- ----------------------------------------------------------------------------
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS bank_account_number     VARCHAR(20),
  ADD COLUMN IF NOT EXISTS bank_name               VARCHAR(100),
  ADD COLUMN IF NOT EXISTS bank_code               VARCHAR(10),
  ADD COLUMN IF NOT EXISTS paystack_recipient_code VARCHAR(100);

-- ----------------------------------------------------------------------------
-- 3. full_name on profiles (used throughout the app)
-- ----------------------------------------------------------------------------
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);

-- ----------------------------------------------------------------------------
-- 4. Disbursement tracking on needs
-- ----------------------------------------------------------------------------
ALTER TABLE public.needs
  ADD COLUMN IF NOT EXISTS transfer_reference VARCHAR(100);
