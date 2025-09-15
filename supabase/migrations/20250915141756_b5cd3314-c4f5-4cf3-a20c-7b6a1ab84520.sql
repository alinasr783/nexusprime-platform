-- Update existing projects with sample project data
UPDATE projects SET project_data = jsonb_build_object(
  'websiteType', 'business',
  'pages', '5',
  'features', ARRAY['responsive_design', 'seo_optimization', 'contact_form', 'blog_system'],
  'brandColors', ARRAY['#2563eb', '#059669', '#7c3aed'],
  'sections', ARRAY['الرئيسية', 'من نحن', 'الخدمات', 'أعمالنا', 'تواصل معنا'],
  'currentPhase', 'التطوير',
  'nextStep', 'إضافة نظام إدارة المحتوى',
  'developer', jsonb_build_object(
    'name', 'أحمد محمد',
    'role', 'مطور Full Stack',
    'avatar', null
  ),
  'milestones', jsonb_build_array(
    jsonb_build_object('id', 1, 'title', 'تجميع المتطلبات', 'completed', true, 'date', '2025-09-10'),
    jsonb_build_object('id', 2, 'title', 'التصميم المبدئي', 'completed', true, 'date', '2025-09-12'),
    jsonb_build_object('id', 3, 'title', 'التطوير', 'completed', false, 'date', '2025-09-20'),
    jsonb_build_object('id', 4, 'title', 'الاختبار', 'completed', false, 'date', '2025-09-25'),
    jsonb_build_object('id', 5, 'title', 'التسليم النهائي', 'completed', false, 'date', '2025-09-30')
  )
) WHERE project_data IS NULL OR project_data = '{}';

-- Add sample pricing structure to app_settings
INSERT INTO app_settings (setting_key, setting_value) VALUES 
('pricing_structure', '{
  "base_prices": {
    "landing": 5000,
    "business": 8000,
    "ecommerce": 12000,
    "custom": 10000
  },
  "page_price": 500,
  "feature_prices": {
    "responsive_design": 1000,
    "seo_optimization": 800,
    "contact_form": 300,
    "blog_system": 1500,
    "payment_gateway": 2000,
    "user_management": 1800,
    "admin_panel": 2500,
    "multi_language": 1200
  }
}')
ON CONFLICT (setting_key) DO UPDATE SET 
setting_value = EXCLUDED.setting_value;

-- Add sample project addons configuration
INSERT INTO app_settings (setting_key, setting_value) VALUES 
('project_addons', '{
  "hosting": {
    "name": "استضافة سنوية",
    "description": "استضافة موقعك لمدة سنة كاملة مع دعم فني",
    "price": 1200,
    "duration": "سنوياً"
  },
  "ssl_certificate": {
    "name": "شهادة SSL",
    "description": "شهادة أمان لحماية موقعك وبيانات عملائك",
    "price": 300,
    "duration": "سنوياً"
  },
  "maintenance": {
    "name": "صيانة شهرية",
    "description": "صيانة وتحديثات شهرية للموقع",
    "price": 500,
    "duration": "شهرياً"
  },
  "seo_package": {
    "name": "باقة SEO متقدمة",
    "description": "تحسين محركات البحث المتقدم لمدة 6 شهور",
    "price": 2500,
    "duration": "6 شهور"
  }
}')
ON CONFLICT (setting_key) DO UPDATE SET 
setting_value = EXCLUDED.setting_value;