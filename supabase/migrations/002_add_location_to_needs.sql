-- ============================================================================
-- BuildBridge Migration: Add location columns to needs table
-- This denormalizes location_state and location_lga onto needs so
-- location displays correctly even when profile data is missing.
-- ============================================================================

-- 1. Add columns to needs table
ALTER TABLE public.needs
  ADD COLUMN IF NOT EXISTS location_state text,
  ADD COLUMN IF NOT EXISTS location_lga text;

-- 2. Backfill profiles that have NULL location from auth.users metadata
--    (Google OAuth signups get a bare profile from the trigger, but the
--     signUp call passes location in raw_user_meta_data)
DO $$
BEGIN
  UPDATE public.profiles p
  SET
    location_state = u.raw_user_meta_data->>'location_state',
    location_lga = u.raw_user_meta_data->>'location_lga'
  FROM auth.users u
  WHERE
    p.user_id = u.id
    AND (p.location_state IS NULL OR p.location_lga IS NULL)
    AND u.raw_user_meta_data->>'location_state' IS NOT NULL;
END $$;

-- 3. Backfill existing needs with location data from their profiles
UPDATE public.needs n
SET
  location_state = p.location_state,
  location_lga = p.location_lga
FROM public.profiles p
WHERE
  n.profile_id = p.id
  AND n.location_state IS NULL
  AND n.location_lga IS NULL;
