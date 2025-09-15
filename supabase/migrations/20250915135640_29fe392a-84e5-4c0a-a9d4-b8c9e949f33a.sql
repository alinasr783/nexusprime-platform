-- Add sample data for better testing
-- Insert sample messages (will be real once types are updated)
INSERT INTO public.project_messages (project_id, sender, message, sender_type, created_at) 
VALUES 
  ((SELECT id FROM public.projects LIMIT 1), 'مدير المشروع', 'أهلاً وسهلاً! تم البدء في مشروعك. سنواصل التحديثات هنا.', 'admin', now() - interval '2 days'),
  ((SELECT id FROM public.projects LIMIT 1), 'مدير المشروع', 'تم الانتهاء من التصميم المبدئي، يرجى المراجعة.', 'admin', now() - interval '1 day'),
  ((SELECT id FROM public.projects LIMIT 1), 'العميل', 'التصميم رائع! هل يمكن تعديل لون الهيدر؟', 'client', now() - interval '6 hours'),
  ((SELECT id FROM public.projects LIMIT 1), 'مدير المشروع', 'بالطبع! ما اللون المفضل لديك؟', 'admin', now() - interval '3 hours');

-- Add sample files to demonstrate file system
INSERT INTO public.project_files (project_id, file_name, file_path, file_type, file_size, uploaded_by, created_at)
VALUES
  ((SELECT id FROM public.projects LIMIT 1), 'تصميم الشعار.png', 'design/logo.png', 'image/png', 245760, 'admin', now() - interval '3 days'),
  ((SELECT id FROM public.projects LIMIT 1), 'متطلبات المشروع.pdf', 'docs/requirements.pdf', 'application/pdf', 1024000, 'client', now() - interval '2 days'),
  ((SELECT id FROM public.projects LIMIT 1), 'الألوان والخطوط.psd', 'design/branding.psd', 'application/x-photoshop', 5242880, 'admin', now() - interval '1 day');