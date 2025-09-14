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