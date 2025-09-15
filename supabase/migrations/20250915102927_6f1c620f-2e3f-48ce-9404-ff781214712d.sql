-- Create storage buckets for project files
INSERT INTO storage.buckets (id, name, public) VALUES ('project-files', 'project-files', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('project-assets', 'project-assets', true);

-- Create project_files table
CREATE TABLE public.project_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT,
  uploaded_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for project_files
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;

-- Create policies for project_files
CREATE POLICY "Users can view files for their own projects" 
ON public.project_files 
FOR SELECT 
USING (project_id IN (
  SELECT id FROM public.projects 
  WHERE client_id IN (
    SELECT id FROM client 
    WHERE email = ((current_setting('request.jwt.claims'::text, true))::json ->> 'email'::text)
  )
));

CREATE POLICY "Users can upload files to their own projects" 
ON public.project_files 
FOR INSERT 
WITH CHECK (project_id IN (
  SELECT id FROM public.projects 
  WHERE client_id IN (
    SELECT id FROM client 
    WHERE email = ((current_setting('request.jwt.claims'::text, true))::json ->> 'email'::text)
  )
));

CREATE POLICY "Users can delete files from their own projects" 
ON public.project_files 
FOR DELETE 
USING (project_id IN (
  SELECT id FROM public.projects 
  WHERE client_id IN (
    SELECT id FROM client 
    WHERE email = ((current_setting('request.jwt.claims'::text, true))::json ->> 'email'::text)
  )
));

-- Create settings table for pricing and add-ons
CREATE TABLE public.app_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for app_settings (admin only)
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can manage settings" 
ON public.app_settings 
FOR ALL 
USING (false);

-- Insert default pricing structure
INSERT INTO public.app_settings (setting_key, setting_value) VALUES 
('pricing_structure', '{
  "base_prices": {
    "portfolio": 3000,
    "business": 5000,
    "ecommerce": 8000,
    "blog": 2500,
    "landing": 2000,
    "custom": 10000
  },
  "page_price": 300,
  "feature_prices": {
    "contact_form": 200,
    "gallery": 300,
    "blog": 500,
    "ecommerce": 2000,
    "booking": 800,
    "multi_language": 600,
    "seo": 400,
    "analytics": 200,
    "social_media": 150,
    "newsletter": 250,
    "live_chat": 300,
    "payment_gateway": 800,
    "user_accounts": 600,
    "admin_panel": 1000
  }
}');

-- Insert add-ons configuration
INSERT INTO public.app_settings (setting_key, setting_value) VALUES 
('project_addons', '{
  "seo_package": {
    "name": "حزمة تحسين محركات البحث",
    "description": "تحسين موقعك لمحركات البحث مع تقرير شهري",
    "price": 800,
    "duration": "شهري"
  },
  "content_writing": {
    "name": "كتابة المحتوى",
    "description": "كتابة محتوى احترافي لموقعك",
    "price": 1500,
    "duration": "مرة واحدة"
  },
  "hosting": {
    "name": "استضافة سنوية",
    "description": "استضافة موقعك على خوادم سريعة وآمنة",
    "price": 1200,
    "duration": "سنوي"
  },
  "maintenance": {
    "name": "صيانة شهرية",
    "description": "صيانة وتحديث موقعك شهرياً",
    "price": 500,
    "duration": "شهري"
  },
  "ssl_certificate": {
    "name": "شهادة SSL",
    "description": "تأمين موقعك بشهادة SSL",
    "price": 300,
    "duration": "سنوي"
  },
  "backup_service": {
    "name": "خدمة النسخ الاحتياطي",
    "description": "نسخ احتياطية يومية لموقعك",
    "price": 200,
    "duration": "شهري"
  }
}');

-- Create project_payments table
CREATE TABLE public.project_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_type TEXT NOT NULL CHECK (payment_type IN ('initial', 'milestone', 'final', 'addon')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue')),
  due_date TIMESTAMP WITH TIME ZONE,
  paid_date TIMESTAMP WITH TIME ZONE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for project_payments
ALTER TABLE public.project_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view payments for their own projects" 
ON public.project_payments 
FOR SELECT 
USING (project_id IN (
  SELECT id FROM public.projects 
  WHERE client_id IN (
    SELECT id FROM client 
    WHERE email = ((current_setting('request.jwt.claims'::text, true))::json ->> 'email'::text)
  )
));

-- Create project_addons table
CREATE TABLE public.project_addons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  addon_key TEXT NOT NULL,
  addon_data JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for project_addons
ALTER TABLE public.project_addons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view addons for their own projects" 
ON public.project_addons 
FOR SELECT 
USING (project_id IN (
  SELECT id FROM public.projects 
  WHERE client_id IN (
    SELECT id FROM client 
    WHERE email = ((current_setting('request.jwt.claims'::text, true))::json ->> 'email'::text)
  )
));

CREATE POLICY "Users can manage addons for their own projects" 
ON public.project_addons 
FOR ALL 
USING (project_id IN (
  SELECT id FROM public.projects 
  WHERE client_id IN (
    SELECT id FROM client 
    WHERE email = ((current_setting('request.jwt.claims'::text, true))::json ->> 'email'::text)
  )
));

-- Create storage policies for project files
CREATE POLICY "Users can view files for their projects" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id IN ('project-files', 'project-assets') AND
  (storage.foldername(name))[1] IN (
    SELECT p.id::text FROM public.projects p 
    JOIN client c ON p.client_id = c.id 
    WHERE c.email = ((current_setting('request.jwt.claims'::text, true))::json ->> 'email'::text)
  )
);

CREATE POLICY "Users can upload files to their projects" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id IN ('project-files', 'project-assets') AND
  (storage.foldername(name))[1] IN (
    SELECT p.id::text FROM public.projects p 
    JOIN client c ON p.client_id = c.id 
    WHERE c.email = ((current_setting('request.jwt.claims'::text, true))::json ->> 'email'::text)
  )
);

CREATE POLICY "Users can delete files from their projects" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id IN ('project-files', 'project-assets') AND
  (storage.foldername(name))[1] IN (
    SELECT p.id::text FROM public.projects p 
    JOIN client c ON p.client_id = c.id 
    WHERE c.email = ((current_setting('request.jwt.claims'::text, true))::json ->> 'email'::text)
  )
);

-- Add triggers for updated_at
CREATE TRIGGER update_project_files_updated_at
BEFORE UPDATE ON public.project_files
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_app_settings_updated_at
BEFORE UPDATE ON public.app_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_payments_updated_at
BEFORE UPDATE ON public.project_payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_addons_updated_at
BEFORE UPDATE ON public.project_addons
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();