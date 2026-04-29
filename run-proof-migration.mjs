import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://yahrksbwvvusfamufoaq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaHJrc2J3dnZ1c2ZhbXVmb2FxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjU0NzUxNiwiZXhwIjoyMDkyMTIzNTE2fQ.ez5bn_BBGE7pzc7MOOKpUyVetody_K_oWD_ndDzgM-4'
);

// Check whether proof columns already exist
const { data, error } = await supabase.from('needs').select('id,proof_photo_url,proof_video_url,proof_caption,proof_submitted_at,disbursed_at').limit(0);
if (error) {
  console.log('Columns MISSING — run this SQL in Supabase SQL Editor:');
  console.log(`
ALTER TABLE public.needs
  ADD COLUMN IF NOT EXISTS proof_photo_url    text,
  ADD COLUMN IF NOT EXISTS proof_video_url    text,
  ADD COLUMN IF NOT EXISTS proof_caption      text,
  ADD COLUMN IF NOT EXISTS proof_submitted_at timestamptz,
  ADD COLUMN IF NOT EXISTS disbursed_at       timestamptz;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS delivered_count integer DEFAULT 0;
  `);
} else {
  console.log('All proof columns already exist!');
}

// Check profiles table
const { data: p, error: pe } = await supabase.from('profiles').select('id,delivered_count').limit(0);
if (pe) {
  console.log('Profile delivered_count missing too — include in SQL above');
} else {
  console.log('Profile delivered_count exists!');
}
