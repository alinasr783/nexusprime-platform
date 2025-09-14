import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Upload, Palette, Globe, Package, DollarSign, Calendar, Check } from 'lucide-react';

interface NewProjectFormProps {
  user: any;
  onProjectCreated: (project: any) => void;
  onCancel: () => void;
}

const NewProjectForm = ({ user, onProjectCreated, onCancel }: NewProjectFormProps) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [projectData, setProjectData] = useState({
    // Client Info (Step 1)
    clientFullName: '',
    clientEmail: '',
    clientPhone: '',
    clientCompany: '',
    clientIndustry: '',
    clientLocation: '',
    socialMedia: {
      facebook: '',
      instagram: '',
      linkedin: '',
      tiktok: '',
      youtube: ''
    },
    
    // Brand Identity (Step 2)
    logoUrl: '',
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
    accentColor: '#ff0000',
    brandFonts: '',
    brandStyle: '',
    inspirationLinks: '',
    
    // Project Info (Step 3)
    name: '',
    shortDescription: '',
    longDescription: '',
    mainGoals: [] as string[],
    projectType: '',
    
    // Project Type Specific Details (Step 4)
    portfolioDetails: {
      pagesCount: '',
      sections: [] as string[],
      previousProjects: '',
      mainCTA: ''
    },
    ecommerceDetails: {
      productsCount: '',
      categories: [] as string[],
      paymentMethods: [] as string[],
      shipping: '',
      discounts: false
    },
    educationDetails: {
      courseType: '',
      pricingPlan: '',
      userRoles: [] as string[],
      certificates: false,
      contentLibrary: ''
    },
    companyDetails: {
      employeeCount: '',
      sections: [] as string[],
      mainCTA: '',
      languages: [] as string[]
    },
    blogDetails: {
      categories: [] as string[],
      adsSystem: false,
      membership: false,
      newsletter: false
    },
    saasDetails: {
      serviceDescription: '',
      mainFeatures: [] as string[],
      subscriptionPlans: '',
      registrationMethod: '',
      apis: [] as string[]
    },
    
    // Technical Structure (Step 5)
    hasDomain: '',
    domainName: '',
    hasHosting: '',
    hostingType: '',
    techPreference: '',
    needsMailServer: false,
    technicalIntegrations: [] as string[],
    
    // Content (Step 6)
    brandSlogans: '',
    brandDescription: '',
    testimonials: '',
    projectTeamMembers: '',
    existingContentUrl: '',
    
    // User Experience (Step 7)
    themePreference: '',
    mood: '',
    userFlow: '',
    mainCTA: '',
    
    // SEO & Marketing (Step 8)
    keywords: '',
    metaDescription: '',
    needsBlog: false,
    marketingIntegrations: [] as string[],
    marketingPlan: [] as string[],
    
    // Project Management (Step 9)
    projectCoordinator: '',
    coordinatorEmail: '',
    authorizedMembers: [] as string[],
    preferredCommunication: '',
    updateFrequency: '',
    
    // Future Add-ons (Step 10)
    futureAddons: [] as string[],
    
    // Billing & Payment (Step 11)
    selectedPackage: '',
    paymentMethod: '',
    billingName: '',
    billingAddress: '',
    taxNumber: ''
  });

  const steps = [
    { number: 1, title: language === 'ar' ? 'بيانات العميل' : 'Client Info', icon: Package },
    { number: 2, title: language === 'ar' ? 'الهوية البصرية' : 'Brand Identity', icon: Palette },
    { number: 3, title: language === 'ar' ? 'بيانات المشروع' : 'Project Info', icon: Globe },
    { number: 4, title: language === 'ar' ? 'التفاصيل التقنية' : 'Technical Details', icon: Package },
    { number: 5, title: language === 'ar' ? 'البنية التقنية' : 'Technical Structure', icon: Globe },
    { number: 6, title: language === 'ar' ? 'المحتوى' : 'Content', icon: Upload },
    { number: 7, title: language === 'ar' ? 'تجربة المستخدم' : 'User Experience', icon: Palette },
    { number: 8, title: language === 'ar' ? 'التسويق والـ SEO' : 'SEO & Marketing', icon: Globe },
    { number: 9, title: language === 'ar' ? 'إدارة المشروع' : 'Project Management', icon: Calendar },
    { number: 10, title: language === 'ar' ? 'الإضافات المستقبلية' : 'Future Add-ons', icon: Package },
    { number: 11, title: language === 'ar' ? 'الفواتير والدفع' : 'Billing & Payment', icon: DollarSign },
    { number: 12, title: language === 'ar' ? 'التأكيد النهائي' : 'Final Confirmation', icon: Check }
  ];

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setProjectData(prev => {
        const parentObj = prev[parent as keyof typeof prev] as any;
        return {
          ...prev,
          [parent]: {
            ...(typeof parentObj === 'object' ? parentObj : {}),
            [child]: value
          }
        };
      });
    } else {
      setProjectData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleArrayToggle = (field: string, item: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setProjectData(prev => {
        const parentObj = prev[parent as keyof typeof prev] as any;
        const currentArray = parentObj[child] as string[];
        return {
          ...prev,
          [parent]: {
            ...parentObj,
            [child]: currentArray.includes(item)
              ? currentArray.filter(i => i !== item)
              : [...currentArray, item]
          }
        };
      });
    } else {
      setProjectData(prev => {
        const currentArray = prev[field as keyof typeof prev] as string[];
        return {
          ...prev,
          [field]: currentArray.includes(item)
            ? currentArray.filter(i => i !== item)
            : [...currentArray, item]
        };
      });
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          client_id: user.id,
          name: projectData.name,
          description: projectData.shortDescription,
          goal: projectData.projectType,
          status: 'new',
          progress: 0,
          project_data: projectData
        })
        .select()
        .single();

      if (error) throw error;

      onProjectCreated(data);
      toast({
        title: language === 'ar' ? 'تم إنشاء المشروع' : 'Project Created',
        description: language === 'ar' ? 'تم إنشاء المشروع بنجاح' : 'Project created successfully'
      });
    } catch (error: any) {
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Client Info
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}</Label>
                <Input
                  value={projectData.clientFullName}
                  onChange={(e) => handleInputChange('clientFullName', e.target.value)}
                  placeholder={language === 'ar' ? 'أحمد محمد علي' : 'John Doe'}
                />
              </div>
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'البريد الإلكتروني *' : 'Email *'}</Label>
                <Input
                  type="email"
                  value={projectData.clientEmail}
                  onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                  placeholder={language === 'ar' ? 'ahmed@example.com' : 'john@example.com'}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'رقم الهاتف (واتساب مفضل) *' : 'Phone (WhatsApp preferred) *'}</Label>
                <Input
                  value={projectData.clientPhone}
                  onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                  placeholder={language === 'ar' ? '+20 100 123 4567' : '+1 (555) 123-4567'}
                />
              </div>
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'الشركة/البراند' : 'Company/Brand'}</Label>
                <Input
                  value={projectData.clientCompany}
                  onChange={(e) => handleInputChange('clientCompany', e.target.value)}
                  placeholder={language === 'ar' ? 'شركة XYZ' : 'XYZ Company'}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'المجال/النشاط' : 'Industry/Activity'}</Label>
                <Select value={projectData.clientIndustry} onValueChange={(value) => handleInputChange('clientIndustry', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'ar' ? 'اختر المجال' : 'Select industry'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">{language === 'ar' ? 'التكنولوجيا' : 'Technology'}</SelectItem>
                    <SelectItem value="healthcare">{language === 'ar' ? 'الرعاية الصحية' : 'Healthcare'}</SelectItem>
                    <SelectItem value="education">{language === 'ar' ? 'التعليم' : 'Education'}</SelectItem>
                    <SelectItem value="retail">{language === 'ar' ? 'التجزئة' : 'Retail'}</SelectItem>
                    <SelectItem value="finance">{language === 'ar' ? 'المالية' : 'Finance'}</SelectItem>
                    <SelectItem value="other">{language === 'ar' ? 'أخرى' : 'Other'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'الموقع الجغرافي' : 'Geographic Location'}</Label>
                <Input
                  value={projectData.clientLocation}
                  onChange={(e) => handleInputChange('clientLocation', e.target.value)}
                  placeholder={language === 'ar' ? 'القاهرة، مصر' : 'New York, USA'}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{language === 'ar' ? 'حسابات التواصل الاجتماعي' : 'Social Media Accounts'}</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Input
                  value={projectData.socialMedia.facebook}
                  onChange={(e) => handleInputChange('socialMedia.facebook', e.target.value)}
                  placeholder={language === 'ar' ? 'رابط فيسبوك' : 'Facebook URL'}
                />
                <Input
                  value={projectData.socialMedia.instagram}
                  onChange={(e) => handleInputChange('socialMedia.instagram', e.target.value)}
                  placeholder={language === 'ar' ? 'رابط انستجرام' : 'Instagram URL'}
                />
                <Input
                  value={projectData.socialMedia.linkedin}
                  onChange={(e) => handleInputChange('socialMedia.linkedin', e.target.value)}
                  placeholder={language === 'ar' ? 'رابط لينكد إن' : 'LinkedIn URL'}
                />
                <Input
                  value={projectData.socialMedia.youtube}
                  onChange={(e) => handleInputChange('socialMedia.youtube', e.target.value)}
                  placeholder={language === 'ar' ? 'رابط يوتيوب' : 'YouTube URL'}
                />
              </div>
            </div>
          </div>
        );

      case 2: // Brand Identity
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'اللوجو' : 'Logo'}</Label>
              <Input
                type="file"
                accept="image/png,image/svg+xml,image/jpeg"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleInputChange('logoUrl', file.name);
                  }
                }}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'اللون الأساسي' : 'Primary Color'}</Label>
                <Input
                  type="color"
                  value={projectData.primaryColor}
                  onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'اللون الثانوي' : 'Secondary Color'}</Label>
                <Input
                  type="color"
                  value={projectData.secondaryColor}
                  onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'اللون المميز' : 'Accent Color'}</Label>
                <Input
                  type="color"
                  value={projectData.accentColor}
                  onChange={(e) => handleInputChange('accentColor', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{language === 'ar' ? 'خطوط البراند' : 'Brand Fonts'}</Label>
              <Input
                value={projectData.brandFonts}
                onChange={(e) => handleInputChange('brandFonts', e.target.value)}
                placeholder={language === 'ar' ? 'مثال: Roboto, Open Sans' : 'Example: Roboto, Open Sans'}
              />
            </div>

            <div className="space-y-2">
              <Label>{language === 'ar' ? 'ستايل الهوية' : 'Brand Style'}</Label>
              <Select value={projectData.brandStyle} onValueChange={(value) => handleInputChange('brandStyle', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={language === 'ar' ? 'اختر الستايل' : 'Select style'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">{language === 'ar' ? 'مودرن' : 'Modern'}</SelectItem>
                  <SelectItem value="classic">{language === 'ar' ? 'كلاسيك' : 'Classic'}</SelectItem>
                  <SelectItem value="playful">{language === 'ar' ? 'مرح' : 'Playful'}</SelectItem>
                  <SelectItem value="professional">{language === 'ar' ? 'مهني' : 'Professional'}</SelectItem>
                  <SelectItem value="luxury">{language === 'ar' ? 'فاخر' : 'Luxury'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{language === 'ar' ? 'مراجع بصرية (روابط مواقع)' : 'Visual References (Website Links)'}</Label>
              <Textarea
                value={projectData.inspirationLinks}
                onChange={(e) => handleInputChange('inspirationLinks', e.target.value)}
                placeholder={language === 'ar' ? 'أضف روابط مواقع تعجبك أو صفحات Dribbble/Behance' : 'Add links to websites you like or Dribbble/Behance pages'}
                rows={3}
              />
            </div>
          </div>
        );

      case 3: // Project Info
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'اسم المشروع/الموقع *' : 'Project/Website Name *'}</Label>
              <Input
                value={projectData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder={language === 'ar' ? 'مثال: متجر الأحذية الذكية' : 'Example: Smart Shoes Store'}
              />
            </div>

            <div className="space-y-2">
              <Label>{language === 'ar' ? 'وصف مختصر (150 حرف) *' : 'Short Description (150 chars) *'}</Label>
              <Input
                value={projectData.shortDescription}
                onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                placeholder={language === 'ar' ? 'وصف قصير يلخص المشروع' : 'Brief description summarizing the project'}
                maxLength={150}
              />
            </div>

            <div className="space-y-2">
              <Label>{language === 'ar' ? 'وصف طويل (200-500 كلمة) *' : 'Long Description (200-500 words) *'}</Label>
              <Textarea
                value={projectData.longDescription}
                onChange={(e) => handleInputChange('longDescription', e.target.value)}
                placeholder={language === 'ar' ? 'وصف تفصيلي عن المشروع وأهدافه' : 'Detailed description of the project and its goals'}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>{language === 'ar' ? 'الأهداف الرئيسية' : 'Main Goals'}</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'sales', label: language === 'ar' ? 'زيادة المبيعات' : 'Increase Sales' },
                  { id: 'portfolio', label: language === 'ar' ? 'عرض البورتفوليو' : 'Showcase Portfolio' },
                  { id: 'community', label: language === 'ar' ? 'بناء مجتمع' : 'Build Community' },
                  { id: 'education', label: language === 'ar' ? 'التعليم' : 'Education' },
                  { id: 'branding', label: language === 'ar' ? 'بناء العلامة التجارية' : 'Brand Building' },
                  { id: 'lead_gen', label: language === 'ar' ? 'جذب العملاء' : 'Lead Generation' }
                ].map((goal) => (
                  <div key={goal.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={goal.id}
                      checked={projectData.mainGoals.includes(goal.id)}
                      onCheckedChange={() => handleArrayToggle('mainGoals', goal.id)}
                    />
                    <Label htmlFor={goal.id} className="text-sm">{goal.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>{language === 'ar' ? 'نوع الموقع *' : 'Website Type *'}</Label>
              <Select value={projectData.projectType} onValueChange={(value) => handleInputChange('projectType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={language === 'ar' ? 'اختر نوع الموقع' : 'Select website type'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="portfolio">{language === 'ar' ? 'بورتفوليو' : 'Portfolio'}</SelectItem>
                  <SelectItem value="ecommerce">{language === 'ar' ? 'متجر إلكتروني' : 'E-commerce Store'}</SelectItem>
                  <SelectItem value="education">{language === 'ar' ? 'منصة تعليمية' : 'Educational Platform'}</SelectItem>
                  <SelectItem value="blog">{language === 'ar' ? 'مدونة/مجلة' : 'Blog/Magazine'}</SelectItem>
                  <SelectItem value="company">{language === 'ar' ? 'موقع شركة' : 'Company Website'}</SelectItem>
                  <SelectItem value="landing">{language === 'ar' ? 'صفحة هبوط' : 'Landing Page'}</SelectItem>
                  <SelectItem value="saas">{language === 'ar' ? 'تطبيق ويب / SaaS' : 'Web App / SaaS'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 12: // Final Confirmation
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">{language === 'ar' ? 'ملخص المشروع الشامل' : 'Comprehensive Project Summary'}</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">{language === 'ar' ? 'اسم العميل' : 'Client Name'}</Label>
                  <p className="text-muted-foreground">{projectData.clientFullName}</p>
                </div>
                <div>
                  <Label className="font-medium">{language === 'ar' ? 'اسم المشروع' : 'Project Name'}</Label>
                  <p className="text-muted-foreground">{projectData.name}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">{language === 'ar' ? 'نوع المشروع' : 'Project Type'}</Label>
                  <p className="text-muted-foreground">{projectData.projectType}</p>
                </div>
                <div>
                  <Label className="font-medium">{language === 'ar' ? 'الشركة' : 'Company'}</Label>
                  <p className="text-muted-foreground">{projectData.clientCompany || 'N/A'}</p>
                </div>
              </div>

              <div>
                <Label className="font-medium">{language === 'ar' ? 'وصف المشروع' : 'Project Description'}</Label>
                <p className="text-muted-foreground">{projectData.shortDescription}</p>
              </div>

              <div>
                <Label className="font-medium">{language === 'ar' ? 'الأهداف الرئيسية' : 'Main Goals'}</Label>
                <p className="text-muted-foreground">{projectData.mainGoals.join(', ') || 'N/A'}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="font-medium">{language === 'ar' ? 'اللون الأساسي' : 'Primary Color'}</Label>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded border" 
                      style={{ backgroundColor: projectData.primaryColor }}
                    ></div>
                    <span className="text-sm text-muted-foreground">{projectData.primaryColor}</span>
                  </div>
                </div>
                <div>
                  <Label className="font-medium">{language === 'ar' ? 'اللون الثانوي' : 'Secondary Color'}</Label>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded border" 
                      style={{ backgroundColor: projectData.secondaryColor }}
                    ></div>
                    <span className="text-sm text-muted-foreground">{projectData.secondaryColor}</span>
                  </div>
                </div>
                <div>
                  <Label className="font-medium">{language === 'ar' ? 'اللون المميز' : 'Accent Color'}</Label>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded border" 
                      style={{ backgroundColor: projectData.accentColor }}
                    ></div>
                    <span className="text-sm text-muted-foreground">{projectData.accentColor}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4: // Project Type Specific Details
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">{language === 'ar' ? 'تفاصيل حسب نوع المشروع' : 'Project Type Specific Details'}</h3>
            
            {projectData.projectType === 'portfolio' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{language === 'ar' ? 'عدد الصفحات المتوقعة' : 'Expected Number of Pages'}</Label>
                  <Select value={projectData.portfolioDetails.pagesCount} onValueChange={(value) => handleInputChange('portfolioDetails.pagesCount', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'ar' ? 'اختر العدد' : 'Select count'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3-5">{language === 'ar' ? '3-5 صفحات' : '3-5 Pages'}</SelectItem>
                      <SelectItem value="5-10">{language === 'ar' ? '5-10 صفحات' : '5-10 Pages'}</SelectItem>
                      <SelectItem value="10+">{language === 'ar' ? '10+ صفحات' : '10+ Pages'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>{language === 'ar' ? 'الأقسام الأساسية' : 'Main Sections'}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'about', label: language === 'ar' ? 'نبذة عني' : 'About Me' },
                      { id: 'work', label: language === 'ar' ? 'أعمالي' : 'My Work' },
                      { id: 'contact', label: language === 'ar' ? 'تواصل معي' : 'Contact Me' },
                      { id: 'services', label: language === 'ar' ? 'خدماتي' : 'Services' },
                      { id: 'testimonials', label: language === 'ar' ? 'آراء العملاء' : 'Testimonials' },
                      { id: 'blog', label: language === 'ar' ? 'مدونة' : 'Blog' }
                    ].map((section) => (
                      <div key={section.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={section.id}
                          checked={projectData.portfolioDetails.sections.includes(section.id)}
                          onCheckedChange={() => handleArrayToggle('portfolioDetails.sections', section.id)}
                        />
                        <Label htmlFor={section.id} className="text-sm">{section.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{language === 'ar' ? 'المشاريع السابقة' : 'Previous Projects'}</Label>
                  <Textarea
                    value={projectData.portfolioDetails.previousProjects}
                    onChange={(e) => handleInputChange('portfolioDetails.previousProjects', e.target.value)}
                    placeholder={language === 'ar' ? 'اكتب عن مشاريعك السابقة (عنوان - وصف - رابط)' : 'Write about your previous projects (title - description - link)'}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{language === 'ar' ? 'الدعوة للعمل الأساسية' : 'Main Call to Action'}</Label>
                  <Select value={projectData.portfolioDetails.mainCTA} onValueChange={(value) => handleInputChange('portfolioDetails.mainCTA', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'ar' ? 'اختر الدعوة للعمل' : 'Select CTA'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contact">{language === 'ar' ? 'اتصل بي' : 'Contact Me'}</SelectItem>
                      <SelectItem value="hire">{language === 'ar' ? 'وظفني' : 'Hire Me'}</SelectItem>
                      <SelectItem value="download_cv">{language === 'ar' ? 'حمل السيرة الذاتية' : 'Download CV'}</SelectItem>
                      <SelectItem value="schedule_call">{language === 'ar' ? 'احجز مكالمة' : 'Schedule Call'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {projectData.projectType === 'ecommerce' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{language === 'ar' ? 'عدد المنتجات المبدئي' : 'Initial Product Count'}</Label>
                    <Input
                      value={projectData.ecommerceDetails.productsCount}
                      onChange={(e) => handleInputChange('ecommerceDetails.productsCount', e.target.value)}
                      placeholder={language === 'ar' ? 'مثال: 50 منتج' : 'Example: 50 products'}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{language === 'ar' ? 'فئات المنتجات' : 'Product Categories'}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'electronics', label: language === 'ar' ? 'إلكترونيات' : 'Electronics' },
                      { id: 'fashion', label: language === 'ar' ? 'أزياء' : 'Fashion' },
                      { id: 'home', label: language === 'ar' ? 'منزل وحديقة' : 'Home & Garden' },
                      { id: 'books', label: language === 'ar' ? 'كتب' : 'Books' },
                      { id: 'sports', label: language === 'ar' ? 'رياضة' : 'Sports' },
                      { id: 'beauty', label: language === 'ar' ? 'جمال وعناية' : 'Beauty & Care' }
                    ].map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={category.id}
                          checked={projectData.ecommerceDetails.categories.includes(category.id)}
                          onCheckedChange={() => handleArrayToggle('ecommerceDetails.categories', category.id)}
                        />
                        <Label htmlFor={category.id} className="text-sm">{category.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{language === 'ar' ? 'طرق الدفع' : 'Payment Methods'}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'cash', label: language === 'ar' ? 'كاش عند الاستلام' : 'Cash on Delivery' },
                      { id: 'visa', label: language === 'ar' ? 'فيزا/ماستركارد' : 'Visa/Mastercard' },
                      { id: 'paypal', label: 'PayPal' },
                      { id: 'fawry', label: language === 'ar' ? 'فوري' : 'Fawry' },
                      { id: 'vodafone_cash', label: language === 'ar' ? 'فودافون كاش' : 'Vodafone Cash' }
                    ].map((payment) => (
                      <div key={payment.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={payment.id}
                          checked={projectData.ecommerceDetails.paymentMethods.includes(payment.id)}
                          onCheckedChange={() => handleArrayToggle('ecommerceDetails.paymentMethods', payment.id)}
                        />
                        <Label htmlFor={payment.id} className="text-sm">{payment.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{language === 'ar' ? 'تفاصيل الشحن' : 'Shipping Details'}</Label>
                  <Select value={projectData.ecommerceDetails.shipping} onValueChange={(value) => handleInputChange('ecommerceDetails.shipping', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'ar' ? 'اختر نوع الشحن' : 'Select shipping type'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="local_free">{language === 'ar' ? 'شحن محلي مجاني' : 'Free Local Shipping'}</SelectItem>
                      <SelectItem value="local_paid">{language === 'ar' ? 'شحن محلي مدفوع' : 'Paid Local Shipping'}</SelectItem>
                      <SelectItem value="international">{language === 'ar' ? 'شحن دولي' : 'International Shipping'}</SelectItem>
                      <SelectItem value="pickup">{language === 'ar' ? 'استلام من المتجر' : 'Store Pickup'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="discounts"
                    checked={projectData.ecommerceDetails.discounts}
                    onCheckedChange={(checked) => handleInputChange('ecommerceDetails.discounts', checked)}
                  />
                  <Label htmlFor="discounts">{language === 'ar' ? 'نظام عروض وخصومات (كوبونات - كاش باك)' : 'Discounts & Offers System (Coupons - Cashback)'}</Label>
                </div>
              </div>
            )}

            {projectData.projectType === 'education' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{language === 'ar' ? 'نوع الكورسات' : 'Course Type'}</Label>
                  <Select value={projectData.educationDetails.courseType} onValueChange={(value) => handleInputChange('educationDetails.courseType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'ar' ? 'اختر نوع الكورس' : 'Select course type'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">{language === 'ar' ? 'فيديوهات مسجلة' : 'Recorded Videos'}</SelectItem>
                      <SelectItem value="live">{language === 'ar' ? 'دروس مباشرة (Zoom/Teams)' : 'Live Sessions (Zoom/Teams)'}</SelectItem>
                      <SelectItem value="articles">{language === 'ar' ? 'مقالات تعليمية' : 'Educational Articles'}</SelectItem>
                      <SelectItem value="pdf">{language === 'ar' ? 'ملفات PDF' : 'PDF Files'}</SelectItem>
                      <SelectItem value="mixed">{language === 'ar' ? 'مختلط' : 'Mixed'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{language === 'ar' ? 'خطة الأسعار' : 'Pricing Plan'}</Label>
                  <Select value={projectData.educationDetails.pricingPlan} onValueChange={(value) => handleInputChange('educationDetails.pricingPlan', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'ar' ? 'اختر خطة الأسعار' : 'Select pricing plan'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">{language === 'ar' ? 'كورس فردي' : 'Individual Course'}</SelectItem>
                      <SelectItem value="monthly">{language === 'ar' ? 'اشتراك شهري' : 'Monthly Subscription'}</SelectItem>
                      <SelectItem value="yearly">{language === 'ar' ? 'اشتراك سنوي' : 'Yearly Subscription'}</SelectItem>
                      <SelectItem value="free">{language === 'ar' ? 'مجاني مع إعلانات' : 'Free with Ads'}</SelectItem>
                      <SelectItem value="freemium">{language === 'ar' ? 'فريميوم (أساسي مجاني + مدفوع)' : 'Freemium (Basic Free + Paid)'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{language === 'ar' ? 'صلاحيات المستخدمين' : 'User Roles'}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'student', label: language === 'ar' ? 'طالب' : 'Student' },
                      { id: 'teacher', label: language === 'ar' ? 'مدرس' : 'Teacher' },
                      { id: 'admin', label: language === 'ar' ? 'مدير' : 'Admin' },
                      { id: 'moderator', label: language === 'ar' ? 'مشرف' : 'Moderator' }
                    ].map((role) => (
                      <div key={role.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={role.id}
                          checked={projectData.educationDetails.userRoles.includes(role.id)}
                          onCheckedChange={() => handleArrayToggle('educationDetails.userRoles', role.id)}
                        />
                        <Label htmlFor={role.id} className="text-sm">{role.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="certificates"
                    checked={projectData.educationDetails.certificates}
                    onCheckedChange={(checked) => handleInputChange('educationDetails.certificates', checked)}
                  />
                  <Label htmlFor="certificates">{language === 'ar' ? 'شهادات إلكترونية عند الإكمال' : 'Electronic Certificates upon Completion'}</Label>
                </div>

                <div className="space-y-2">
                  <Label>{language === 'ar' ? 'مكتبة المحتوى المبدئية' : 'Initial Content Library'}</Label>
                  <Textarea
                    value={projectData.educationDetails.contentLibrary}
                    onChange={(e) => handleInputChange('educationDetails.contentLibrary', e.target.value)}
                    placeholder={language === 'ar' ? 'وصف المحتوى التعليمي المتوفر (عناوين الكورسات - عدد الدروس)' : 'Description of available educational content (course titles - number of lessons)'}
                    rows={3}
                  />
                </div>
              </div>
            )}

            {projectData.projectType === 'company' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{language === 'ar' ? 'عدد الموظفين' : 'Number of Employees'}</Label>
                  <Select value={projectData.companyDetails.employeeCount} onValueChange={(value) => handleInputChange('companyDetails.employeeCount', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'ar' ? 'اختر العدد' : 'Select count'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">{language === 'ar' ? '1-10 موظفين' : '1-10 Employees'}</SelectItem>
                      <SelectItem value="11-50">{language === 'ar' ? '11-50 موظف' : '11-50 Employees'}</SelectItem>
                      <SelectItem value="51-200">{language === 'ar' ? '51-200 موظف' : '51-200 Employees'}</SelectItem>
                      <SelectItem value="200+">{language === 'ar' ? '200+ موظف' : '200+ Employees'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{language === 'ar' ? 'أقسام الموقع' : 'Website Sections'}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'services', label: language === 'ar' ? 'الخدمات' : 'Services' },
                      { id: 'team', label: language === 'ar' ? 'الفريق' : 'Team' },
                      { id: 'testimonials', label: language === 'ar' ? 'آراء العملاء' : 'Testimonials' },
                      { id: 'blog', label: language === 'ar' ? 'مدونة' : 'Blog' },
                      { id: 'careers', label: language === 'ar' ? 'الوظائف' : 'Careers' },
                      { id: 'contact', label: language === 'ar' ? 'تواصل معنا' : 'Contact Us' }
                    ].map((section) => (
                      <div key={section.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={section.id}
                          checked={projectData.companyDetails.sections.includes(section.id)}
                          onCheckedChange={() => handleArrayToggle('companyDetails.sections', section.id)}
                        />
                        <Label htmlFor={section.id} className="text-sm">{section.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{language === 'ar' ? 'الدعوة للعمل الأساسية' : 'Main Call to Action'}</Label>
                  <Select value={projectData.companyDetails.mainCTA} onValueChange={(value) => handleInputChange('companyDetails.mainCTA', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'ar' ? 'اختر الدعوة للعمل' : 'Select CTA'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="book_call">{language === 'ar' ? 'احجز مكالمة' : 'Book a Call'}</SelectItem>
                      <SelectItem value="get_quote">{language === 'ar' ? 'احصل على عرض سعر' : 'Get a Quote'}</SelectItem>
                      <SelectItem value="contact_us">{language === 'ar' ? 'تواصل معنا' : 'Contact Us'}</SelectItem>
                      <SelectItem value="start_project">{language === 'ar' ? 'ابدأ مشروعك' : 'Start Your Project'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{language === 'ar' ? 'اللغات المطلوبة' : 'Required Languages'}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'arabic', label: language === 'ar' ? 'العربية' : 'Arabic' },
                      { id: 'english', label: language === 'ar' ? 'الإنجليزية' : 'English' },
                      { id: 'french', label: language === 'ar' ? 'الفرنسية' : 'French' },
                      { id: 'german', label: language === 'ar' ? 'الألمانية' : 'German' }
                    ].map((lang) => (
                      <div key={lang.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={lang.id}
                          checked={projectData.companyDetails.languages.includes(lang.id)}
                          onCheckedChange={() => handleArrayToggle('companyDetails.languages', lang.id)}
                        />
                        <Label htmlFor={lang.id} className="text-sm">{lang.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {projectData.projectType === 'blog' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{language === 'ar' ? 'أقسام المدونة' : 'Blog Categories'}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'politics', label: language === 'ar' ? 'سياسة' : 'Politics' },
                      { id: 'economy', label: language === 'ar' ? 'اقتصاد' : 'Economy' },
                      { id: 'technology', label: language === 'ar' ? 'تكنولوجيا' : 'Technology' },
                      { id: 'entertainment', label: language === 'ar' ? 'ترفيه' : 'Entertainment' },
                      { id: 'sports', label: language === 'ar' ? 'رياضة' : 'Sports' },
                      { id: 'lifestyle', label: language === 'ar' ? 'نمط حياة' : 'Lifestyle' }
                    ].map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={category.id}
                          checked={projectData.blogDetails.categories.includes(category.id)}
                          onCheckedChange={() => handleArrayToggle('blogDetails.categories', category.id)}
                        />
                        <Label htmlFor={category.id} className="text-sm">{category.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="adsSystem"
                    checked={projectData.blogDetails.adsSystem}
                    onCheckedChange={(checked) => handleInputChange('blogDetails.adsSystem', checked)}
                  />
                  <Label htmlFor="adsSystem">{language === 'ar' ? 'نظام إعلانات (Google AdSense)' : 'Advertisement System (Google AdSense)'}</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="membership"
                    checked={projectData.blogDetails.membership}
                    onCheckedChange={(checked) => handleInputChange('blogDetails.membership', checked)}
                  />
                  <Label htmlFor="membership">{language === 'ar' ? 'عضويات مدفوعة (محتوى مميز)' : 'Paid Memberships (Premium Content)'}</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="newsletter"
                    checked={projectData.blogDetails.newsletter}
                    onCheckedChange={(checked) => handleInputChange('blogDetails.newsletter', checked)}
                  />
                  <Label htmlFor="newsletter">{language === 'ar' ? 'نشرة إخبارية (Newsletter)' : 'Newsletter'}</Label>
                </div>
              </div>
            )}

            {projectData.projectType === 'saas' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{language === 'ar' ? 'وصف الخدمة' : 'Service Description'}</Label>
                  <Textarea
                    value={projectData.saasDetails.serviceDescription}
                    onChange={(e) => handleInputChange('saasDetails.serviceDescription', e.target.value)}
                    placeholder={language === 'ar' ? 'اشرح الخدمة التي يقدمها التطبيق' : 'Explain the service your app provides'}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{language === 'ar' ? 'أهم الميزات' : 'Key Features'}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'dashboard', label: language === 'ar' ? 'لوحة تحكم' : 'Dashboard' },
                      { id: 'analytics', label: language === 'ar' ? 'تحليلات' : 'Analytics' },
                      { id: 'api', label: 'API Integration' },
                      { id: 'reports', label: language === 'ar' ? 'تقارير' : 'Reports' },
                      { id: 'notifications', label: language === 'ar' ? 'إشعارات' : 'Notifications' },
                      { id: 'collaboration', label: language === 'ar' ? 'تعاون الفريق' : 'Team Collaboration' }
                    ].map((feature) => (
                      <div key={feature.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={feature.id}
                          checked={projectData.saasDetails.mainFeatures.includes(feature.id)}
                          onCheckedChange={() => handleArrayToggle('saasDetails.mainFeatures', feature.id)}
                        />
                        <Label htmlFor={feature.id} className="text-sm">{feature.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{language === 'ar' ? 'خطط الاشتراك' : 'Subscription Plans'}</Label>
                  <Select value={projectData.saasDetails.subscriptionPlans} onValueChange={(value) => handleInputChange('saasDetails.subscriptionPlans', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'ar' ? 'اختر نوع الخطط' : 'Select plan type'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free_basic_premium">{language === 'ar' ? 'مجاني - أساسي - مميز' : 'Free - Basic - Premium'}</SelectItem>
                      <SelectItem value="basic_premium">{language === 'ar' ? 'أساسي - مميز' : 'Basic - Premium'}</SelectItem>
                      <SelectItem value="single_premium">{language === 'ar' ? 'خطة واحدة مميزة' : 'Single Premium Plan'}</SelectItem>
                      <SelectItem value="usage_based">{language === 'ar' ? 'حسب الاستخدام' : 'Usage-based'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{language === 'ar' ? 'طريقة التسجيل' : 'Registration Method'}</Label>
                  <Select value={projectData.saasDetails.registrationMethod} onValueChange={(value) => handleInputChange('saasDetails.registrationMethod', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'ar' ? 'اختر طريقة التسجيل' : 'Select registration method'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">{language === 'ar' ? 'بريد إلكتروني وكلمة مرور' : 'Email & Password'}</SelectItem>
                      <SelectItem value="google">{language === 'ar' ? 'تسجيل دخول بجوجل' : 'Google Login'}</SelectItem>
                      <SelectItem value="social">{language === 'ar' ? 'وسائل التواصل الاجتماعي' : 'Social Media'}</SelectItem>
                      <SelectItem value="sso">{language === 'ar' ? 'تسجيل دخول موحد (SSO)' : 'Single Sign-On (SSO)'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{language === 'ar' ? 'التكاملات المطلوبة' : 'Required Integrations'}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'stripe', label: 'Stripe Payment' },
                      { id: 'mailchimp', label: 'MailChimp' },
                      { id: 'slack', label: 'Slack' },
                      { id: 'zapier', label: 'Zapier' },
                      { id: 'google_analytics', label: 'Google Analytics' },
                      { id: 'custom_api', label: language === 'ar' ? 'API مخصص' : 'Custom API' }
                    ].map((integration) => (
                      <div key={integration.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={integration.id}
                          checked={projectData.saasDetails.apis.includes(integration.id)}
                          onCheckedChange={() => handleArrayToggle('saasDetails.apis', integration.id)}
                        />
                        <Label htmlFor={integration.id} className="text-sm">{integration.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!projectData.projectType && (
              <div className="text-center py-8 text-muted-foreground">
                {language === 'ar' ? 'اختر نوع المشروع في الخطوة السابقة أولاً' : 'Please select a project type in the previous step first'}
              </div>
            )}
          </div>
        );

      case 5: // Technical Structure
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">{language === 'ar' ? 'البنية التقنية' : 'Technical Structure'}</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'هل عندك دومين؟' : 'Do you have a domain?'}</Label>
                <Select value={projectData.hasDomain} onValueChange={(value) => handleInputChange('hasDomain', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'ar' ? 'اختر' : 'Select'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">{language === 'ar' ? 'نعم' : 'Yes'}</SelectItem>
                    <SelectItem value="no">{language === 'ar' ? 'لا' : 'No'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {projectData.hasDomain === 'yes' && (
                <div className="space-y-2">
                  <Label>{language === 'ar' ? 'اسم الدومين' : 'Domain Name'}</Label>
                  <Input
                    value={projectData.domainName}
                    onChange={(e) => handleInputChange('domainName', e.target.value)}
                    placeholder="example.com"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>{language === 'ar' ? 'هل عندك استضافة؟' : 'Do you have hosting?'}</Label>
              <Select value={projectData.hasHosting} onValueChange={(value) => handleInputChange('hasHosting', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={language === 'ar' ? 'اختر' : 'Select'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">{language === 'ar' ? 'نعم' : 'Yes'}</SelectItem>
                  <SelectItem value="no">{language === 'ar' ? 'لا' : 'No'}</SelectItem>
                  <SelectItem value="need_recommendation">{language === 'ar' ? 'أحتاج توصية' : 'Need Recommendation'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {projectData.hasHosting === 'yes' && (
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'نوع الاستضافة' : 'Hosting Type'}</Label>
                <Select value={projectData.hostingType} onValueChange={(value) => handleInputChange('hostingType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'ar' ? 'اختر النوع' : 'Select type'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shared">{language === 'ar' ? 'استضافة مشتركة' : 'Shared Hosting'}</SelectItem>
                    <SelectItem value="vps">{language === 'ar' ? 'خادم افتراضي (VPS)' : 'VPS'}</SelectItem>
                    <SelectItem value="dedicated">{language === 'ar' ? 'خادم مخصص' : 'Dedicated Server'}</SelectItem>
                    <SelectItem value="cloud">{language === 'ar' ? 'استضافة سحابية' : 'Cloud Hosting'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label>{language === 'ar' ? 'التكنولوجيا المفضلة' : 'Technology Preference'}</Label>
              <Select value={projectData.techPreference} onValueChange={(value) => handleInputChange('techPreference', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={language === 'ar' ? 'اختر التكنولوجيا' : 'Select technology'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wordpress">{language === 'ar' ? 'وردبريس' : 'WordPress'}</SelectItem>
                  <SelectItem value="react">{language === 'ar' ? 'React (تطبيق حديث)' : 'React (Modern App)'}</SelectItem>
                  <SelectItem value="nextjs">{language === 'ar' ? 'Next.js (أداء عالي)' : 'Next.js (High Performance)'}</SelectItem>
                  <SelectItem value="shopify">{language === 'ar' ? 'Shopify (متجر)' : 'Shopify (Store)'}</SelectItem>
                  <SelectItem value="custom">{language === 'ar' ? 'مخصص' : 'Custom'}</SelectItem>
                  <SelectItem value="no_preference">{language === 'ar' ? 'لا تفضيل - اختر الأفضل' : 'No Preference - Choose Best'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="mailServer"
                checked={projectData.needsMailServer}
                onCheckedChange={(checked) => handleInputChange('needsMailServer', checked)}
              />
              <Label htmlFor="mailServer">{language === 'ar' ? 'أحتاج خادم بريد إلكتروني مخصص' : 'Need Custom Mail Server'}</Label>
            </div>

            <div className="space-y-2">
              <Label>{language === 'ar' ? 'التكاملات المطلوبة' : 'Required Integrations'}</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'crm', label: 'CRM System' },
                  { id: 'zapier', label: 'Zapier' },
                  { id: 'google_analytics', label: 'Google Analytics' },
                  { id: 'facebook_pixel', label: 'Facebook Pixel' },
                  { id: 'mailchimp', label: 'MailChimp' },
                  { id: 'whatsapp_api', label: 'WhatsApp API' }
                ].map((integration) => (
                  <div key={integration.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={integration.id}
                      checked={projectData.technicalIntegrations.includes(integration.id)}
                      onCheckedChange={() => handleArrayToggle('technicalIntegrations', integration.id)}
                    />
                    <Label htmlFor={integration.id} className="text-sm">{integration.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 6: // Content
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">{language === 'ar' ? 'المحتوى' : 'Content'}</h3>
            
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'شعارات/سلوغان البراند' : 'Brand Slogans'}</Label>
              <Textarea
                value={projectData.brandSlogans}
                onChange={(e) => handleInputChange('brandSlogans', e.target.value)}
                placeholder={language === 'ar' ? 'مثال: "نحن نبني المستقبل معًا"' : 'Example: "Building the future together"'}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>{language === 'ar' ? 'وصف البراند التفصيلي' : 'Detailed Brand Description'}</Label>
              <Textarea
                value={projectData.brandDescription}
                onChange={(e) => handleInputChange('brandDescription', e.target.value)}
                placeholder={language === 'ar' ? 'اكتب وصفًا شاملاً عن البراند، قيمه، ورؤيته' : 'Write a comprehensive description about the brand, its values, and vision'}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>{language === 'ar' ? 'آراء العملاء/المراجعات' : 'Testimonials/Reviews'}</Label>
              <Textarea
                value={projectData.testimonials}
                onChange={(e) => handleInputChange('testimonials', e.target.value)}
                placeholder={language === 'ar' ? 'أسماء العملاء + آرائهم + تقييماتهم' : 'Customer names + their reviews + ratings'}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>{language === 'ar' ? 'أعضاء الفريق' : 'Team Members'}</Label>
              <Textarea
                value={projectData.projectTeamMembers}
                onChange={(e) => handleInputChange('projectTeamMembers', e.target.value)}
                placeholder={language === 'ar' ? 'الاسم - المنصب - نبذة قصيرة - LinkedIn' : 'Name - Position - Brief bio - LinkedIn'}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>{language === 'ar' ? 'المحتوى الجاهز (رابط أو ملف)' : 'Ready Content (Link or File)'}</Label>
              <Input
                value={projectData.existingContentUrl}
                onChange={(e) => handleInputChange('existingContentUrl', e.target.value)}
                placeholder={language === 'ar' ? 'رابط Google Drive أو Dropbox للمحتوى' : 'Google Drive or Dropbox link for content'}
              />
            </div>
          </div>
        );

      case 7: // User Experience
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">{language === 'ar' ? 'تجربة المستخدم' : 'User Experience'}</h3>
            
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'تفضيل ستايل الواجهة' : 'Interface Style Preference'}</Label>
              <Select value={projectData.themePreference} onValueChange={(value) => handleInputChange('themePreference', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={language === 'ar' ? 'اختر الستايل' : 'Select style'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">{language === 'ar' ? 'داكن' : 'Dark'}</SelectItem>
                  <SelectItem value="light">{language === 'ar' ? 'فاتح' : 'Light'}</SelectItem>
                  <SelectItem value="both">{language === 'ar' ? 'كلاهما (مع إمكانية التبديل)' : 'Both (with toggle)'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{language === 'ar' ? 'المزاج العام للتصميم' : 'Overall Design Mood'}</Label>
              <Select value={projectData.mood} onValueChange={(value) => handleInputChange('mood', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={language === 'ar' ? 'اختر المزاج' : 'Select mood'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fun">{language === 'ar' ? 'مرح' : 'Fun'}</SelectItem>
                  <SelectItem value="corporate">{language === 'ar' ? 'مهني/شركات' : 'Corporate'}</SelectItem>
                  <SelectItem value="luxury">{language === 'ar' ? 'فاخر' : 'Luxury'}</SelectItem>
                  <SelectItem value="minimal">{language === 'ar' ? 'بسيط/مينيمال' : 'Minimal'}</SelectItem>
                  <SelectItem value="colorful">{language === 'ar' ? 'ملون/حيوي' : 'Colorful'}</SelectItem>
                  <SelectItem value="tech">{language === 'ar' ? 'تقني/مستقبلي' : 'Tech/Futuristic'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{language === 'ar' ? 'تدفق المستخدم المفضل' : 'Preferred User Flow'}</Label>
              <Select value={projectData.userFlow} onValueChange={(value) => handleInputChange('userFlow', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={language === 'ar' ? 'اختر التدفق' : 'Select flow'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single_scroll">{language === 'ar' ? 'صفحة واحدة تمرير طويل' : 'Single Page Long Scroll'}</SelectItem>
                  <SelectItem value="multi_pages">{language === 'ar' ? 'صفحات متعددة' : 'Multiple Pages'}</SelectItem>
                  <SelectItem value="wizard">{language === 'ar' ? 'خطوات متسلسلة (Wizard)' : 'Wizard Flow'}</SelectItem>
                  <SelectItem value="dashboard">{language === 'ar' ? 'لوحة تحكم' : 'Dashboard'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{language === 'ar' ? 'الدعوة للعمل الرئيسية' : 'Main Call to Action'}</Label>
              <Input
                value={projectData.mainCTA}
                onChange={(e) => handleInputChange('mainCTA', e.target.value)}
                placeholder={language === 'ar' ? 'مثال: "ابدأ الآن مجاناً"' : 'Example: "Start Free Now"'}
              />
            </div>
          </div>
        );

      case 8: // SEO & Marketing
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">{language === 'ar' ? 'التسويق والـ SEO' : 'SEO & Marketing'}</h3>
            
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'الكلمات المفتاحية الأساسية' : 'Main Keywords'}</Label>
              <Textarea
                value={projectData.keywords}
                onChange={(e) => handleInputChange('keywords', e.target.value)}
                placeholder={language === 'ar' ? 'مثال: تصميم مواقع، متجر إلكتروني، تطوير تطبيقات' : 'Example: web design, e-commerce, app development'}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>{language === 'ar' ? 'وصف ميتا (Meta Description)' : 'Meta Description'}</Label>
              <Textarea
                value={projectData.metaDescription}
                onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                placeholder={language === 'ar' ? 'وصف مختصر للموقع يظهر في نتائج البحث (150-160 حرف)' : 'Brief site description for search results (150-160 chars)')}
                rows={2}
                maxLength={160}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="needsBlog"
                checked={projectData.needsBlog}
                onCheckedChange={(checked) => handleInputChange('needsBlog', checked)}
              />
              <Label htmlFor="needsBlog">{language === 'ar' ? 'أحتاج قسم مدونة للـ SEO' : 'Need Blog Section for SEO'}</Label>
            </div>

            <div className="space-y-2">
              <Label>{language === 'ar' ? 'تكاملات التسويق' : 'Marketing Integrations'}</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'google_search_console', label: 'Google Search Console' },
                  { id: 'google_analytics', label: 'Google Analytics' },
                  { id: 'facebook_pixel', label: 'Facebook Pixel' },
                  { id: 'tiktok_pixel', label: 'TikTok Pixel' },
                  { id: 'google_ads', label: 'Google Ads' },
                  { id: 'linkedin_insight', label: 'LinkedIn Insight' }
                ].map((integration) => (
                  <div key={integration.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={integration.id}
                      checked={projectData.marketingIntegrations.includes(integration.id)}
                      onCheckedChange={() => handleArrayToggle('marketingIntegrations', integration.id)}
                    />
                    <Label htmlFor={integration.id} className="text-sm">{integration.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>{language === 'ar' ? 'خطة التسويق' : 'Marketing Plan'}</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'seo', label: language === 'ar' ? 'تحسين محركات البحث (SEO)' : 'Search Engine Optimization (SEO)' },
                  { id: 'paid_ads', label: language === 'ar' ? 'الإعلانات المدفوعة' : 'Paid Advertising' },
                  { id: 'social_media', label: language === 'ar' ? 'وسائل التواصل الاجتماعي' : 'Social Media Marketing' },
                  { id: 'email_marketing', label: language === 'ar' ? 'التسويق بالبريد الإلكتروني' : 'Email Marketing' },
                  { id: 'content_marketing', label: language === 'ar' ? 'تسويق المحتوى' : 'Content Marketing' },
                  { id: 'influencer_marketing', label: language === 'ar' ? 'تسويق المؤثرين' : 'Influencer Marketing' }
                ].map((plan) => (
                  <div key={plan.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={plan.id}
                      checked={projectData.marketingPlan.includes(plan.id)}
                      onCheckedChange={() => handleArrayToggle('marketingPlan', plan.id)}
                    />
                    <Label htmlFor={plan.id} className="text-sm">{plan.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 9: // Project Management
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">{language === 'ar' ? 'إدارة المشروع والـ Workflow' : 'Project Management & Workflow'}</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'منسق المشروع' : 'Project Coordinator'}</Label>
                <Input
                  value={projectData.projectCoordinator}
                  onChange={(e) => handleInputChange('projectCoordinator', e.target.value)}
                  placeholder={language === 'ar' ? 'اسم المسؤول عن المتابعة' : 'Name of person responsible for follow-up'}
                />
              </div>
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'إيميل المنسق' : 'Coordinator Email'}</Label>
                <Input
                  type="email"
                  value={projectData.coordinatorEmail}
                  onChange={(e) => handleInputChange('coordinatorEmail', e.target.value)}
                  placeholder={language === 'ar' ? 'البريد الإلكتروني للمنسق' : 'Coordinator email address'}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{language === 'ar' ? 'الأشخاص المصرح لهم بالمتابعة' : 'Authorized Team Members'}</Label>
              <Textarea
                value={projectData.authorizedMembers.join('\n')}
                onChange={(e) => handleInputChange('authorizedMembers', e.target.value.split('\n').filter(Boolean))}
                placeholder={language === 'ar' ? 'أسماء وإيميلات الأشخاص المصرح لهم (سطر لكل شخص)' : 'Names and emails of authorized people (one per line)'}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>{language === 'ar' ? 'طريقة التواصل المفضلة' : 'Preferred Communication Method'}</Label>
              <Select value={projectData.preferredCommunication} onValueChange={(value) => handleInputChange('preferredCommunication', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={language === 'ar' ? 'اختر طريقة التواصل' : 'Select communication method'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</SelectItem>
                  <SelectItem value="whatsapp">{language === 'ar' ? 'واتساب' : 'WhatsApp'}</SelectItem>
                  <SelectItem value="slack">{language === 'ar' ? 'سلاك' : 'Slack'}</SelectItem>
                  <SelectItem value="telegram">{language === 'ar' ? 'تيليجرام' : 'Telegram'}</SelectItem>
                  <SelectItem value="calls">{language === 'ar' ? 'مكالمات هاتفية' : 'Phone Calls'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{language === 'ar' ? 'تكرار التحديثات' : 'Update Frequency'}</Label>
              <Select value={projectData.updateFrequency} onValueChange={(value) => handleInputChange('updateFrequency', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={language === 'ar' ? 'اختر التكرار' : 'Select frequency'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">{language === 'ar' ? 'يومي' : 'Daily'}</SelectItem>
                  <SelectItem value="weekly">{language === 'ar' ? 'أسبوعي' : 'Weekly'}</SelectItem>
                  <SelectItem value="milestone">{language === 'ar' ? 'عند كل مرحلة مهمة' : 'Milestone-based'}</SelectItem>
                  <SelectItem value="as_needed">{language === 'ar' ? 'عند الحاجة' : 'As Needed'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 10: // Future Add-ons
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">{language === 'ar' ? 'إضافات مستقبلية' : 'Future Add-ons'}</h3>
            
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'الميزات التي قد تحتاجها مستقبلاً' : 'Features you might need in the future'}</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'advanced_payments', label: language === 'ar' ? 'مدفوعات متقدمة (Apple Pay/Google Pay)' : 'Advanced Payments (Apple Pay/Google Pay)' },
                  { id: 'memberships', label: language === 'ar' ? 'عضويات مدفوعة' : 'Paid Memberships' },
                  { id: 'multi_language', label: language === 'ar' ? 'متعدد اللغات' : 'Multi-language' },
                  { id: 'multi_vendor', label: language === 'ar' ? 'متعدد البائعين' : 'Multi-vendor' },
                  { id: 'marketplace', label: language === 'ar' ? 'ميزات السوق الإلكتروني' : 'Marketplace Features' },
                  { id: 'gamification', label: language === 'ar' ? 'التلعيب (نقاط - شارات)' : 'Gamification (Points - Badges)' },
                  { id: 'ai_chatbot', label: language === 'ar' ? 'شات بوت ذكي' : 'AI Chatbot' },
                  { id: 'ai_recommendations', label: language === 'ar' ? 'توصيات ذكية' : 'AI Recommendations' },
                  { id: 'mobile_app', label: language === 'ar' ? 'تطبيق جوال' : 'Mobile App' },
                  { id: 'advanced_analytics', label: language === 'ar' ? 'تحليلات متقدمة' : 'Advanced Analytics' },
                  { id: 'crm_integration', label: language === 'ar' ? 'تكامل CRM متقدم' : 'Advanced CRM Integration' },
                  { id: 'api_marketplace', label: language === 'ar' ? 'سوق APIs' : 'API Marketplace' }
                ].map((addon) => (
                  <div key={addon.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={addon.id}
                      checked={projectData.futureAddons.includes(addon.id)}
                      onCheckedChange={() => handleArrayToggle('futureAddons', addon.id)}
                    />
                    <Label htmlFor={addon.id} className="text-sm">{addon.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 11: // Billing & Payment
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">{language === 'ar' ? 'الفواتير والدفع' : 'Billing & Payment'}</h3>
            
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'الباقة المختارة' : 'Selected Package'}</Label>
              <Select value={projectData.selectedPackage} onValueChange={(value) => handleInputChange('selectedPackage', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={language === 'ar' ? 'اختر الباقة' : 'Select package'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">{language === 'ar' ? 'أساسية' : 'Basic'}</SelectItem>
                  <SelectItem value="pro">{language === 'ar' ? 'احترافية' : 'Professional'}</SelectItem>
                  <SelectItem value="premium">{language === 'ar' ? 'مميزة' : 'Premium'}</SelectItem>
                  <SelectItem value="enterprise">{language === 'ar' ? 'للمؤسسات' : 'Enterprise'}</SelectItem>
                  <SelectItem value="custom">{language === 'ar' ? 'مخصصة' : 'Custom'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{language === 'ar' ? 'طريقة الدفع المفضلة' : 'Preferred Payment Method'}</Label>
              <Select value={projectData.paymentMethod} onValueChange={(value) => handleInputChange('paymentMethod', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={language === 'ar' ? 'اختر طريقة الدفع' : 'Select payment method'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">{language === 'ar' ? 'كاش' : 'Cash'}</SelectItem>
                  <SelectItem value="bank_transfer">{language === 'ar' ? 'تحويل بنكي' : 'Bank Transfer'}</SelectItem>
                  <SelectItem value="credit_card">{language === 'ar' ? 'بطاقة ائتمانية' : 'Credit Card'}</SelectItem>
                  <SelectItem value="paypal">{language === 'ar' ? 'باي بال' : 'PayPal'}</SelectItem>
                  <SelectItem value="fawry">{language === 'ar' ? 'فوري' : 'Fawry'}</SelectItem>
                  <SelectItem value="installments">{language === 'ar' ? 'أقساط' : 'Installments'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">{language === 'ar' ? 'بيانات الفاتورة' : 'Billing Information'}</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{language === 'ar' ? 'الاسم في الفاتورة' : 'Billing Name'}</Label>
                  <Input
                    value={projectData.billingName}
                    onChange={(e) => handleInputChange('billingName', e.target.value)}
                    placeholder={language === 'ar' ? 'الاسم كما سيظهر في الفاتورة' : 'Name as it will appear on invoice'}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{language === 'ar' ? 'الرقم الضريبي (اختياري)' : 'Tax Number (Optional)'}</Label>
                  <Input
                    value={projectData.taxNumber}
                    onChange={(e) => handleInputChange('taxNumber', e.target.value)}
                    placeholder={language === 'ar' ? 'الرقم الضريبي للشركة' : 'Company tax number'}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{language === 'ar' ? 'عنوان الفاتورة' : 'Billing Address'}</Label>
                <Textarea
                  value={projectData.billingAddress}
                  onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                  placeholder={language === 'ar' ? 'العنوان الكامل للفاتورة' : 'Complete billing address'}
                  rows={2}
                />
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {language === 'ar' ? 'هذه الخطوة قيد التطوير' : 'This step is under development'}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {language === 'ar' ? 'الخطوة ' + currentStep + ' من ' + steps.length : 'Step ' + currentStep + ' of ' + steps.length}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {language === 'ar' ? 'العودة' : 'Back'}
        </Button>
        <h2 className="text-2xl font-bold">{language === 'ar' ? 'مشروع جديد - تخطيط شامل' : 'New Project - Comprehensive Planning'}</h2>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between overflow-x-auto pb-2">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-shrink-0">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              step.number === currentStep 
                ? 'bg-primary text-primary-foreground' 
                : step.number < currentStep 
                ? 'bg-primary/20 text-primary' 
                : 'bg-muted text-muted-foreground'
            }`}>
              {step.number}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-8 h-0.5 mx-1 ${
                step.number < currentStep ? 'bg-primary' : 'bg-muted'
              }`} />
            )}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {React.createElement(steps[currentStep - 1].icon, { className: "h-5 w-5" })}
            {steps[currentStep - 1].title}
            <span className="text-sm text-muted-foreground">
              ({currentStep}/{steps.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrev} 
          disabled={currentStep === 1}
        >
          {language === 'ar' ? 'السابق' : 'Previous'}
        </Button>
        
        {currentStep === steps.length ? (
          <Button onClick={handleSubmit} disabled={loading || !projectData.name || !projectData.shortDescription}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? (language === 'ar' ? 'جاري الإنشاء...' : 'Creating...') : (language === 'ar' ? 'إنشاء المشروع' : 'Create Project')}
          </Button>
        ) : (
          <Button onClick={handleNext}>
            {language === 'ar' ? 'التالي' : 'Next'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default NewProjectForm;