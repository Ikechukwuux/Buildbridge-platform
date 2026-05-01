import fs from 'fs';

const TOKEN = 'sbp_1df92d95f8d7fbd1cef389881f7d6dcdab4eb997';
const REF = 'yahrksbwvvusfamufoaq'; // from .env

async function query(sql) {
    console.log("Executing SQL:", sql.substring(0, 50) + "...");
    const res = await fetch(`https://api.supabase.com/v1/projects/${REF}/database/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: sql })
    });
    console.log("Status:", res.status);
    if (!res.ok) {
        console.error("Error:", await res.text());
    } else {
        const data = await res.json();
        console.log("Success:", JSON.stringify(data).substring(0, 100));
    }
}

async function run() {
    const sql = `
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
  moderated_by UUID REFERENCES public.users(id),
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
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
    `;
    await query(sql);
}

run();
