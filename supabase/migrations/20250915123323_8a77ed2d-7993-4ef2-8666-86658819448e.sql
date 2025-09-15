-- Enable RLS on project_messages table
ALTER TABLE public.project_messages ENABLE ROW LEVEL SECURITY;

-- Check if there are any other tables without RLS enabled
-- Ensure all public tables have RLS enabled
DO $$ 
BEGIN
  -- Enable RLS on all public tables if not already enabled
  PERFORM 
    'ALTER TABLE ' || schemaname || '.' || tablename || ' ENABLE ROW LEVEL SECURITY;'
  FROM pg_tables 
  WHERE schemaname = 'public' 
  AND tablename NOT IN (
    SELECT tablename 
    FROM pg_tables t 
    JOIN pg_class c ON c.relname = t.tablename 
    WHERE c.relrowsecurity = true 
    AND t.schemaname = 'public'
  );
END $$;