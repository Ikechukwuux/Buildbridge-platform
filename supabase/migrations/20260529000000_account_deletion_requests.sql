-- account_deletion_requests
-- NDPA 2023 compliance: users can request deletion of their account + personal data.
-- The actual removal/anonymisation is handled by an internal job that processes
-- this queue within 30 days of the request.

CREATE TABLE IF NOT EXISTS account_deletion_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  processed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  admin_notes TEXT,
  CONSTRAINT one_open_request_per_user
    UNIQUE (user_id, status) DEFERRABLE INITIALLY DEFERRED
);

CREATE INDEX IF NOT EXISTS idx_account_deletion_requests_status
  ON account_deletion_requests(status, requested_at);
CREATE INDEX IF NOT EXISTS idx_account_deletion_requests_user
  ON account_deletion_requests(user_id);

ALTER TABLE account_deletion_requests ENABLE ROW LEVEL SECURITY;

-- Drop policies before recreating so this migration is safe to re-run
DROP POLICY IF EXISTS "deletion_requests_select_own" ON account_deletion_requests;
DROP POLICY IF EXISTS "deletion_requests_insert_own" ON account_deletion_requests;
DROP POLICY IF EXISTS "deletion_requests_cancel_own" ON account_deletion_requests;

-- A user can read their own request
CREATE POLICY "deletion_requests_select_own" ON account_deletion_requests
  FOR SELECT
  USING (user_id = auth.uid());

-- A user can create their own request
CREATE POLICY "deletion_requests_insert_own" ON account_deletion_requests
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- A user can cancel their own pending request
CREATE POLICY "deletion_requests_cancel_own" ON account_deletion_requests
  FOR UPDATE
  USING (user_id = auth.uid() AND status = 'pending')
  WITH CHECK (user_id = auth.uid() AND status IN ('pending', 'cancelled'));
