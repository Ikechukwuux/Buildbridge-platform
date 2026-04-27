-- BuildBridge Migration: Add bio column to profiles
-- The profile page uses profile.bio but the column was never defined
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio text;
