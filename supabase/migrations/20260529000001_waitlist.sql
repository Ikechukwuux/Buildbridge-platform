-- waitlist table for the Coming Soon page email capture
-- Stores email, timestamp, and user type (artisan or donor)

CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  user_type TEXT NOT NULL DEFAULT 'donor' CHECK (user_type IN ('artisan', 'donor')),
  source TEXT DEFAULT 'coming_soon',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT waitlist_email_unique UNIQUE (email)
);

CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_waitlist_user_type ON waitlist(user_type);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "waitlist_insert_public" ON waitlist;
DROP POLICY IF EXISTS "waitlist_select_service" ON waitlist;

-- Public insert (pre-auth, anyone can join the waitlist)
CREATE POLICY "waitlist_insert_public" ON waitlist
  FOR INSERT
  WITH CHECK (true);

-- Only service role can read (admin-only via service key)
CREATE POLICY "waitlist_select_service" ON waitlist
  FOR SELECT
  USING (false);
