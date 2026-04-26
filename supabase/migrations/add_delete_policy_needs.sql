-- Add DELETE policy for needs table
-- Users can only delete their own needs (via their profile_id)
-- This was missing from the original migration, causing deletes to silently fail due to RLS

CREATE POLICY "Users can delete own needs"
  ON public.needs FOR DELETE
  USING (
    profile_id IN (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
  );
