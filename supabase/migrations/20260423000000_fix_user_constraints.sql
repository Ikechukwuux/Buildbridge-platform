-- Drop the restrictive constraint that prevents email-based registration
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS phone_verified_when_registered;

-- Also loosen the valid_phone constraint to allow email-based identifiers or placeholders
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS valid_phone;
ALTER TABLE public.users ADD CONSTRAINT valid_phone CHECK (phone ~ '^[A-Za-z0-9._%+-@]{3,40}$' OR phone ~ '^\+?[0-9]{10,15}$');

-- Ensure phone_verified_at can be null for now, or default it to now() for non-OTP users
ALTER TABLE public.users ALTER COLUMN phone_verified_at DROP NOT NULL;
