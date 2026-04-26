-- BuildBridge: Ensure profiles and needs tables exist
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- ============================================================
-- 1. PROFILES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     text,
  trade_category text,
  trade_other_description text,
  location_state text,
  location_lga  text,
  badge_level   text DEFAULT 'level_0_unverified',
  vouch_count   integer DEFAULT 0,
  delivered_count integer DEFAULT 0,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies: users can read/update their own profile, anyone can read profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public profiles are viewable"
  ON public.profiles FOR SELECT
  USING (true);

-- ============================================================
-- 2. NEEDS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.needs (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id      uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_name       text NOT NULL,
  item_cost       numeric NOT NULL,
  photo_url       text,
  story           text,
  impact_statement text,
  location_state  text,
  location_lga    text,
  deadline        date,
  status          text DEFAULT 'pending_review',
  published_at    timestamptz,
  funded_amount   numeric DEFAULT 0,
  pledge_count    integer DEFAULT 0,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.needs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own needs"
  ON public.needs FOR SELECT
  USING (
    profile_id IN (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own needs"
  ON public.needs FOR INSERT
  WITH CHECK (
    profile_id IN (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own needs"
  ON public.needs FOR UPDATE
  USING (
    profile_id IN (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Published needs are publicly viewable"
  ON public.needs FOR SELECT
  USING (status IN ('active', 'completed', 'pending_review'));

-- ============================================================
-- 3. AUTO-CREATE PROFILE ON USER SIGNUP (Trigger)
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, location_state, location_lga)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'location_state',
    NEW.raw_user_meta_data->>'location_lga'
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if any, then recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
