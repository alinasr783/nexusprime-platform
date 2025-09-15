-- Fix RLS issues by enabling RLS on storage objects table
-- The storage.objects policies were created but RLS may not be enabled on the table
-- Let's ensure all necessary tables have RLS enabled

-- Enable RLS on storage.objects (this is usually already enabled, but let's make sure)
-- Note: This might fail if already enabled, but that's OK
DO $$
BEGIN
  ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN duplicate_object THEN
    -- Table already has RLS enabled, nothing to do
    NULL;
END $$;