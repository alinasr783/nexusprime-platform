-- Create project_messages table for communication
CREATE TABLE IF NOT EXISTS public.project_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL,
  sender TEXT NOT NULL,
  message TEXT NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('client', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.project_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for project messages
CREATE POLICY "Users can view messages for their own projects" 
ON public.project_messages 
FOR SELECT 
USING (project_id IN (
  SELECT projects.id 
  FROM projects 
  WHERE projects.client_id IN (
    SELECT client.id 
    FROM client 
    WHERE client.email = ((current_setting('request.jwt.claims'::text, true))::json ->> 'email'::text)
  )
));

CREATE POLICY "Users can send messages to their own projects" 
ON public.project_messages 
FOR INSERT 
WITH CHECK (project_id IN (
  SELECT projects.id 
  FROM projects 
  WHERE projects.client_id IN (
    SELECT client.id 
    FROM client 
    WHERE client.email = ((current_setting('request.jwt.claims'::text, true))::json ->> 'email'::text)
  )
));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_project_messages_updated_at
BEFORE UPDATE ON public.project_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some dummy data for demonstration
INSERT INTO public.project_messages (project_id, sender, message, sender_type, created_at) VALUES 
('1940182b-ed78-44fb-b99b-f7c9fc11b8e4', 'مدير المشروع', 'تم الانتهاء من التصميم المبدئي، يرجى المراجعة', 'admin', now() - interval '2 hours'),
('1940182b-ed78-44fb-b99b-f7c9fc11b8e4', 'العميل', 'رائع! يمكن تعديل لون الهيدر؟', 'client', now() - interval '1 hour'),
('1940182b-ed78-44fb-b99b-f7c9fc11b8e4', 'مدير المشروع', 'بالتأكيد! ما هو اللون المفضل لديك؟', 'admin', now() - interval '30 minutes');

-- Insert dummy project data if not exists
INSERT INTO public.projects (id, name, description, status, progress, project_data, client_id, goal) 
VALUES (
  '1940182b-ed78-44fb-b99b-f7c9fc11b8e4',
  'موقع شركة التقنية المتقدمة',
  'تطوير موقع إلكتروني متكامل لشركة تقنية',
  'in_progress',
  65,
  '{
    "websiteType": "corporate",
    "pages": ["home", "about", "services", "contact", "blog"],
    "features": ["seo", "responsive", "cms", "analytics", "security"],
    "designPreferences": {
      "colors": ["#3B82F6", "#10B981", "#8B5CF6"],
      "style": "modern"
    },
    "additionalServices": ["hosting", "maintenance", "seo"]
  }',
  '11111111-1111-1111-1111-111111111111',
  'إنشاء موقع إلكتروني احترافي يعكس هوية الشركة'
) ON CONFLICT (id) DO NOTHING;

-- Insert dummy client if not exists
INSERT INTO public.client (id, email, phone, password) 
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'client@example.com',
  '+201234567890',
  'hashed_password'
) ON CONFLICT (id) DO NOTHING;

-- Insert dummy payment data
INSERT INTO public.project_payments (project_id, amount, payment_type, status, due_date, description) VALUES 
('1940182b-ed78-44fb-b99b-f7c9fc11b8e4', 5000, 'initial', 'paid', now() - interval '10 days', 'دفعة مقدمة - 50%'),
('1940182b-ed78-44fb-b99b-f7c9fc11b8e4', 3000, 'progress', 'pending', now() + interval '5 days', 'دفعة التقدم - 30%'),
('1940182b-ed78-44fb-b99b-f7c9fc11b8e4', 2000, 'final', 'pending', now() + interval '15 days', 'الدفعة النهائية - 20%')
ON CONFLICT DO NOTHING;

-- Insert dummy addon data
INSERT INTO public.project_addons (project_id, addon_key, addon_data, status) VALUES 
('1940182b-ed78-44fb-b99b-f7c9fc11b8e4', 'ssl_certificate', '{"name": "شهادة SSL", "price": 500, "description": "تأمين الموقع بشهادة SSL"}', 'active'),
('1940182b-ed78-44fb-b99b-f7c9fc11b8e4', 'advanced_analytics', '{"name": "تحليلات متقدمة", "price": 800, "description": "تقارير تحليلية مفصلة"}', 'active')
ON CONFLICT DO NOTHING;

-- Insert dummy app settings for pricing and addons
INSERT INTO public.app_settings (setting_key, setting_value) VALUES 
('pricing_structure', '{
  "websiteTypes": {
    "basic": {"name": "أساسي", "basePrice": 5000, "pages": 5, "features": ["responsive", "seo"]},
    "business": {"name": "تجاري", "basePrice": 10000, "pages": 10, "features": ["responsive", "seo", "cms", "analytics"]},
    "corporate": {"name": "مؤسسي", "basePrice": 20000, "pages": 15, "features": ["responsive", "seo", "cms", "analytics", "security", "advanced_admin"]},
    "ecommerce": {"name": "متجر إلكتروني", "basePrice": 25000, "pages": 20, "features": ["responsive", "seo", "cms", "analytics", "security", "payment_gateway", "inventory"]}
  },
  "additionalPages": {"price": 500, "name": "صفحة إضافية"},
  "features": {
    "cms": {"name": "نظام إدارة المحتوى", "price": 2000},
    "analytics": {"name": "تحليلات الموقع", "price": 1000},
    "security": {"name": "حماية متقدمة", "price": 1500},
    "multilingual": {"name": "دعم متعدد اللغات", "price": 2500},
    "advanced_seo": {"name": "تحسين محركات البحث المتقدم", "price": 1800}
  }
}'),
('addon_config', '{
  "ssl_certificate": {"name": "شهادة SSL", "price": 500, "description": "تأمين الموقع بشهادة SSL معتمدة"},
  "advanced_analytics": {"name": "تحليلات متقدمة", "price": 800, "description": "تقارير تحليلية مفصلة وإحصائيات متقدمة"},
  "backup_service": {"name": "خدمة النسخ الاحتياطي", "price": 300, "description": "نسخ احتياطية يومية تلقائية"},
  "premium_support": {"name": "دعم فني متميز", "price": 1200, "description": "دعم فني على مدار الساعة"},
  "custom_domain": {"name": "نطاق مخصص", "price": 600, "description": "نطاق مخصص باسم شركتك"},
  "email_hosting": {"name": "استضافة البريد الإلكتروني", "price": 400, "description": "حسابات بريد إلكتروني مهنية"}
}')
ON CONFLICT (setting_key) DO UPDATE SET 
  setting_value = EXCLUDED.setting_value,
  updated_at = now();