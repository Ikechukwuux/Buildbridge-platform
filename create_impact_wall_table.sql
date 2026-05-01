DO $$ BEGIN
    CREATE TYPE public.moderation_status AS ENUM (
        'pending', 'approved', 'rejected', 'revision_requested', 'flagged_fraud'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.impact_wall_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  need_id UUID NOT NULL UNIQUE REFERENCES public.needs(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  photo_url TEXT,
  video_url TEXT,
  video_thumbnail_url TEXT,
  caption TEXT NOT NULL CHECK (char_length(caption) >= 20 AND char_length(caption) <= 500),
  opted_in_at TIMESTAMPTZ NOT NULL,
  public_display_consent BOOLEAN DEFAULT TRUE,
  moderation_status public.moderation_status DEFAULT 'pending',
  moderated_by UUID REFERENCES auth.users(id),
  moderation_notes TEXT,
  moderated_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.impact_wall_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "impact_wall_select_published" ON public.impact_wall_submissions;
CREATE POLICY "impact_wall_select_published" ON public.impact_wall_submissions
  FOR SELECT USING (published_at IS NOT NULL AND moderation_status = 'approved');

DROP POLICY IF EXISTS "impact_wall_select_own" ON public.impact_wall_submissions;
CREATE POLICY "impact_wall_select_own" ON public.impact_wall_submissions
  FOR SELECT
  USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "impact_wall_insert_own" ON public.impact_wall_submissions;
CREATE POLICY "impact_wall_insert_own" ON public.impact_wall_submissions
  FOR INSERT
  WITH CHECK (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "impact_wall_admin_all" ON public.impact_wall_submissions;
CREATE POLICY "impact_wall_admin_all" ON public.impact_wall_submissions
  FOR ALL
  USING (false); -- Admin system disabled until migration is run
