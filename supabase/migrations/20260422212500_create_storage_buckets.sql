-- Create the 'needs' bucket for storing artisan need photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('needs', 'needs', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow public access to need photos
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'needs' );

-- Policy to allow authenticated users to upload photos to 'needs' bucket
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'needs' AND
  auth.role() = 'authenticated'
);

-- Policy to allow users to update/delete their own photos
CREATE POLICY "Owner Access"
ON storage.objects FOR ALL
USING (
  bucket_id = 'needs' AND
  auth.uid() = owner
);
