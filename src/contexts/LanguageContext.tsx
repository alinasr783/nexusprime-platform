import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.features': 'Features',
    'nav.pricing': 'Pricing',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'nav.signup': 'Sign Up',
    'nav.language': 'عربي',
    
    // Hero Section
    'hero.title': 'Manage your projects from idea to delivery — all in one place',
    'hero.subtitle': "Not just a design or a website... it's a complete experience: from sending your idea to going live — tracking every step in real time.",
    'hero.cta.primary': 'Start Now',
    'hero.cta.secondary': 'Contact Us',
    'hero.trust': 'Trusted by 10,000+ businesses worldwide',
    'hero.logo': 'Logo',
    'hero.features.realtime': 'Real-time Tracking',
    'hero.features.ai': 'AI-Powered',
    'hero.features.global': 'Global Access',
    
    'nav.dark': 'Dark Mode',
    'nav.light': 'Light Mode',
    
    // Features
    'features.title': 'Powerful Features for Your Success',
    'features.subtitle': 'Everything you need to manage your projects and clients efficiently',
    
    // Benefits
    'benefits.title': 'Why Choose TrueFolio?',
    'benefits.subtitle': 'Transform your business with our comprehensive platform',
    
    // Why Us
    'whyus.title': 'Why TrueFolio Stands Out',
    'whyus.subtitle': 'See what makes us the preferred choice for thousands of businesses',
    
    // Demo
    'demo.title': 'See It In Action',
    'demo.subtitle': 'Watch how TrueFolio transforms your workflow',
    
    // Templates
    'templates.title': 'Template Library',
    'templates.subtitle': 'Ready-to-use templates for every industry',
    
    // Referral
    'referral.title': 'Built-in Referral Program',
    'referral.subtitle': 'Grow your business through satisfied clients',
    
    // Addons
    'addons.title': 'After-Delivery Add-ons Store',
    'addons.subtitle': 'Extend your services with premium add-ons',
    
    // Testimonials
    'testimonials.title': 'What Our Clients Say',
    'testimonials.subtitle': 'Success stories from businesses like yours',
    
    // Case Studies
    'casestudies.title': 'Success Stories',
    'casestudies.subtitle': 'Real results from real businesses',
    
    // Integrations
    'integrations.title': 'Seamless Integrations',
    'integrations.subtitle': 'Connect with your favorite tools',
    
    // Blog
    'blog.title': 'Latest Insights',
    'blog.subtitle': 'Tips and strategies to grow your business',
    
    // Newsletter
    'newsletter.title': 'Stay Updated',
    'newsletter.subtitle': 'Get the latest tips and features delivered to your inbox',
    'newsletter.placeholder': 'Enter your email',
    'newsletter.cta': 'Subscribe Now',
    
    'feature.datacenter.title': 'Client Data Center',
    'feature.datacenter.description': 'Centralized hub for all your client information, documents, and communication history.',
    
    'feature.tracker.title': 'Project Tracker',
    'feature.tracker.description': 'Real-time project monitoring with progress tracking and milestone management.',
    
    'feature.templates.title': 'Template Library',
    'feature.templates.description': 'Ready-to-use templates and resources to accelerate your project delivery.',
    
    'feature.configurator.title': 'Package Configurator',
    'feature.configurator.description': 'Flexible package creation and customization for different client needs.',
    
    'feature.addons.title': 'After Delivery Add-ons',
    'feature.addons.description': 'Extend your services with post-delivery support and additional features.',
    
    'feature.content.title': 'Ready-made Content Kits',
    'feature.content.description': 'Pre-designed content packages to jumpstart your marketing campaigns.',
    
    'feature.referral.title': 'Built-in Referral Program',
    'feature.referral.description': 'Automated referral system to grow your business through satisfied clients.',
    
    // How It Works
    'how.title': 'How It Works',
    'how.step1.title': 'Setup Your Account',
    'how.step1.description': 'Create your account and configure your workspace in minutes.',
    'how.step2.title': 'Import Your Data',
    'how.step2.description': 'Seamlessly migrate your existing client data and projects.',
    'how.step3.title': 'Start Managing',
    'how.step3.description': 'Begin tracking projects and delivering exceptional results.',
    
    // Pricing
    'pricing.title': 'Choose Your Plan',
    'pricing.subtitle': 'Flexible pricing to match your business needs',
    'pricing.monthly': 'Monthly',
    'pricing.yearly': 'Yearly',
    'pricing.cta': 'Get Started',
    
    // FAQ
    'faq.title': 'Frequently Asked Questions',
    'faq.q1': 'What is included in the free trial?',
    'faq.a1': 'Our 14-day free trial includes access to all features with no limitations. No credit card required.',
    'faq.q2': 'Can I change my plan anytime?',
    'faq.a2': 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.',
    'faq.q3': 'Is my data secure?',
    'faq.a3': 'Absolutely. We use enterprise-grade security with encrypted data storage and regular backups.',
    
    // Contact
    'contact.title': 'Get in Touch',
    'contact.subtitle': 'Ready to transform your business? Contact us today.',
    'contact.name': 'Full Name',
    'contact.email': 'Email Address',
    'contact.company': 'Company Name',
    'contact.message': 'Message',
    'contact.send': 'Send Message',
    
    // Footer
    'footer.description': 'Empowering businesses with comprehensive SaaS solutions for project management and client success.',
    'footer.links': 'Quick Links',
    'footer.legal': 'Legal',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.rights': '© 2024 NexusPrime. All rights reserved.'
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.features': 'المميزات',
    'nav.pricing': 'الأسعار',
    'nav.about': 'حولنا',
    'nav.contact': 'اتصل بنا',
    'nav.login': 'تسجيل الدخول',
    'nav.signup': 'إنشاء حساب',
    'nav.language': 'English',
    
    // Hero Section
    'hero.title': 'ادارة مشاريعك من اول الفكرة لحد التسليم - كله في مكان واحد',
    'hero.subtitle': 'مش مجرد تصميم او موقع... ديه تجربة كاملة : من اول ما تبعت فكرتك لحد ما مشروعك يبقى اونلاين - وانت متابع كل خطوة لحظة بلحظة',
    'hero.cta.primary': 'ابدأ الآن',
    'hero.cta.secondary': 'تواصل معانا',
    'hero.trust': 'موثوق به من أكثر من 10,000 شركة حول العالم',
    'hero.logo': 'شعار',
    'hero.features.realtime': 'تتبع لحظي',
    'hero.features.ai': 'مدعوم بالذكاء الاصطناعي',
    'hero.features.global': 'وصول عالمي',
    
    'nav.dark': 'الوضع المظلم',
    'nav.light': 'الوضع المضيء',
    
    // Features
    'features.title': 'مميزات قوية لنجاحك',
    'features.subtitle': 'كل ما تحتاجه لإدارة مشاريعك وعملائك بكفاءة',
    
    // Benefits
    'benefits.title': 'ليه تختار TrueFolio؟',
    'benefits.subtitle': 'حوّل أعمالك مع منصتنا الشاملة',
    
    // Why Us
    'whyus.title': 'ليه TrueFolio مختلف؟',
    'whyus.subtitle': 'شوف إيه اللي يخلينا الاختيار المفضل لآلاف الشركات',
    
    // Demo
    'demo.title': 'شوفها وهي شغالة',
    'demo.subtitle': 'اتفرج إزاي TrueFolio بيغير طريقة شغلك',
    
    // Templates
    'templates.title': 'مكتبة القوالب',
    'templates.subtitle': 'قوالب جاهزة لكل المجالات',
    
    // Referral
    'referral.title': 'برنامج إحالة مدمج',
    'referral.subtitle': 'نمي أعمالك من خلال عملاءك الراضيين',
    
    // Addons
    'addons.title': 'متجر الإضافات بعد التسليم',
    'addons.subtitle': 'وسع خدماتك بإضافات مميزة',
    
    // Testimonials
    'testimonials.title': 'إيه اللي بيقوله عملاءنا',
    'testimonials.subtitle': 'قصص نجاح من شركات زيك',
    
    // Case Studies
    'casestudies.title': 'قصص النجاح',
    'casestudies.subtitle': 'نتائج حقيقية من شركات حقيقية',
    
    // Integrations
    'integrations.title': 'تكاملات سلسة',
    'integrations.subtitle': 'اتصل بأدواتك المفضلة',
    
    // Blog
    'blog.title': 'آخر الرؤى',
    'blog.subtitle': 'نصائح واستراتيجيات لتنمية أعمالك',
    
    // Newsletter
    'newsletter.title': 'خليك متابع',
    'newsletter.subtitle': 'احصل على آخر النصائح والميزات في إيميلك',
    'newsletter.placeholder': 'اكتب إيميلك',
    'newsletter.cta': 'اشترك دلوقتي',
    
    'feature.datacenter.title': 'مركز بيانات العملاء',
    'feature.datacenter.description': 'مركز موحد لجميع معلومات عملائك والمستندات وتاريخ التواصل.',
    
    'feature.tracker.title': 'متتبع المشاريع',
    'feature.tracker.description': 'مراقبة المشاريع في الوقت الفعلي مع تتبع التقدم وإدارة المعالم.',
    
    'feature.templates.title': 'مكتبة القوالب',
    'feature.templates.description': 'قوالب جاهزة للاستخدام وموارد لتسريع تسليم مشاريعك.',
    
    'feature.configurator.title': 'منشئ الحزم',
    'feature.configurator.description': 'إنشاء وتخصيص مرن للحزم لتلبية احتياجات العملاء المختلفة.',
    
    'feature.addons.title': 'إضافات ما بعد التسليم',
    'feature.addons.description': 'وسّع خدماتك بدعم ما بعد التسليم والميزات الإضافية.',
    
    'feature.content.title': 'حزم المحتوى الجاهزة',
    'feature.content.description': 'حزم محتوى مصممة مسبقاً لبدء حملاتك التسويقية بسرعة.',
    
    'feature.referral.title': 'برنامج إحالة مدمج',
    'feature.referral.description': 'نظام إحالة آلي لتنمية أعمالك من خلال العملاء الراضين.',
    
    // How It Works
    'how.title': 'كيف يعمل',
    'how.step1.title': 'إعداد حسابك',
    'how.step1.description': 'أنشئ حسابك وقم بتكوين مساحة العمل في دقائق.',
    'how.step2.title': 'استيراد بياناتك',
    'how.step2.description': 'نقل سلس لبيانات العملاء والمشاريع الحالية.',
    'how.step3.title': 'ابدأ الإدارة',
    'how.step3.description': 'ابدأ في تتبع المشاريع وتقديم نتائج استثنائية.',
    
    // Pricing
    'pricing.title': 'اختر خطتك',
    'pricing.subtitle': 'أسعار مرنة تناسب احتياجات عملك',
    'pricing.monthly': 'شهرياً',
    'pricing.yearly': 'سنوياً',
    'pricing.cta': 'ابدأ الآن',
    
    // FAQ
    'faq.title': 'الأسئلة الشائعة',
    'faq.q1': 'ما المتضمن في التجربة المجانية؟',
    'faq.a1': 'تتضمن تجربتنا المجانية لمدة 14 يوماً الوصول لجميع الميزات بلا قيود. لا حاجة لبطاقة ائتمانية.',
    'faq.q2': 'هل يمكنني تغيير خطتي في أي وقت؟',
    'faq.a2': 'نعم، يمكنك الترقية أو التراجع عن خطتك في أي وقت. تدخل التغييرات حيز التنفيذ فوراً.',
    'faq.q3': 'هل بياناتي آمنة؟',
    'faq.a3': 'بالطبع. نستخدم أمان على مستوى المؤسسات مع تشفير البيانات والنسخ الاحتياطي المنتظم.',
    
    // Contact
    'contact.title': 'تواصل معنا',
    'contact.subtitle': 'مستعد لتحويل أعمالك؟ اتصل بنا اليوم.',
    'contact.name': 'الاسم الكامل',
    'contact.email': 'عنوان البريد الإلكتروني',
    'contact.company': 'اسم الشركة',
    'contact.message': 'الرسالة',
    'contact.send': 'إرسال الرسالة',
    
    // Footer
    'footer.description': 'تمكين الشركات بحلول SaaS شاملة لإدارة المشاريع ونجاح العملاء.',
    'footer.links': 'روابط سريعة',
    'footer.legal': 'قانوني',
    'footer.privacy': 'سياسة الخصوصية',
    'footer.terms': 'شروط الخدمة',
    'footer.rights': '© 2024 نيكسوس برايم. جميع الحقوق محفوظة.'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'ar')) {
      setLanguage(savedLang);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};