-- Fix RLS issues by enabling RLS on all public tables that might have been missed
DO $$ 
BEGIN
  -- Enable RLS on all public tables if not already enabled
  FOR rec IN 
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename NOT IN (
      SELECT c.relname
      FROM pg_class c 
      JOIN pg_namespace n ON c.relnamespace = n.oid
      WHERE n.nspname = 'public' 
      AND c.relkind = 'r'
      AND c.relrowsecurity = true
    )
  LOOP
    EXECUTE 'ALTER TABLE public.' || rec.tablename || ' ENABLE ROW LEVEL SECURITY;';
  END LOOP;
END $$;

-- Add sample messages for the communication system
INSERT INTO public.project_messages (project_id, sender, message, sender_type) 
SELECT 
  p.id,
  'مدير المشروع',
  'أهلاً بك! تم البدء في العمل على مشروعك. سنرسل لك التحديثات هنا.',
  'admin'
FROM public.projects p
WHERE NOT EXISTS (
  SELECT 1 FROM public.project_messages pm WHERE pm.project_id = p.id
);

-- Add sample admin responses
INSERT INTO public.project_messages (project_id, sender, message, sender_type) 
SELECT 
  p.id,
  'مدير المشروع',
  'تم الانتهاء من التصميم المبدئي. يرجى المراجعة وإبداء الملاحظات.',
  'admin'
FROM public.projects p
WHERE EXISTS (
  SELECT 1 FROM public.project_messages pm WHERE pm.project_id = p.id
);

-- Add sample client responses
INSERT INTO public.project_messages (project_id, sender, message, sender_type) 
SELECT 
  p.id,
  'العميل',
  'شكراً لك! التصميم رائع، هل يمكن تعديل الألوان قليلاً؟',
  'client'
FROM public.projects p
WHERE EXISTS (
  SELECT 1 FROM public.project_messages pm WHERE pm.project_id = p.id AND pm.sender_type = 'admin'
);

-- Update timestamps to be more realistic
UPDATE public.project_messages 
SET created_at = now() - (random() * interval '7 days'),
    updated_at = now() - (random() * interval '7 days')
WHERE created_at > now() - interval '1 minute';