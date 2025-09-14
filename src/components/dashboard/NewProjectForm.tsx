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
    // Basic Info
    name: '',
    description: '',
    goal: '',
    
    // Brand Identity
    preferredColors: '',
    fonts: '',
    inspirationWebsites: '',
    
    // Content Setup
    sections: [] as string[],
    initialContent: '',
    needsReadyContent: false,
    
    // Functionalities
    features: [] as string[],
    integrations: [] as string[],
    
    // Hosting & Domain
    hasDomain: '',
    domainName: '',
    needsHosting: '',
    
    // Design Preferences
    template: '',
    styleDirection: '',
    
    // Timeline
    startDate: '',
    expectedDelivery: '',
    
    // Budget
    package: '',
    addons: [] as string[],
    
    // Contact Info
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    preferredContact: ''
  });

  const steps = [
    { number: 1, title: language === 'ar' ? 'معلومات أساسية' : 'Basic Information', icon: Package },
    { number: 2, title: language === 'ar' ? 'هوية البراند' : 'Brand Identity', icon: Palette },
    { number: 3, title: language === 'ar' ? 'المحتوى' : 'Content Setup', icon: Globe },
    { number: 4, title: language === 'ar' ? 'الوظائف' : 'Functionalities', icon: Package },
    { number: 5, title: language === 'ar' ? 'الاستضافة' : 'Hosting & Domain', icon: Globe },
    { number: 6, title: language === 'ar' ? 'التصميم' : 'Design', icon: Palette },
    { number: 7, title: language === 'ar' ? 'الجدول الزمني' : 'Timeline', icon: Calendar },
    { number: 8, title: language === 'ar' ? 'الميزانية' : 'Budget', icon: DollarSign },
    { number: 9, title: language === 'ar' ? 'التأكيد' : 'Confirmation', icon: Check }
  ];

  const handleInputChange = (field: string, value: any) => {
    setProjectData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (field: string, item: string) => {
    setProjectData(prev => {
      const currentArray = prev[field as keyof typeof prev] as string[];
      return {
        ...prev,
        [field]: currentArray.includes(item)
          ? currentArray.filter(i => i !== item)
          : [...currentArray, item]
      };
    });
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
          description: projectData.description,
          goal: projectData.goal,
          status: 'new',
          progress: 0,
          project_data: projectData
        })
        .select()
        .single();

      if (error) throw error;

      onProjectCreated(data);
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
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'اسم المشروع *' : 'Project Name *'}</Label>
              <Input
                value={projectData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder={language === 'ar' ? 'مثال: متجر XYZ' : 'Example: XYZ Store'}
              />
            </div>
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'وصف قصير *' : 'Short Description *'}</Label>
              <Textarea
                value={projectData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder={language === 'ar' ? 'اكتب وصف مختصر عن المشروع' : 'Write a brief description of the project'}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'الهدف الأساسي *' : 'Main Goal *'}</Label>
              <Select value={projectData.goal} onValueChange={(value) => handleInputChange('goal', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={language === 'ar' ? 'اختر الهدف' : 'Select goal'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="portfolio">{language === 'ar' ? 'بورتفوليو شخصي' : 'Personal Portfolio'}</SelectItem>
                  <SelectItem value="ecommerce">{language === 'ar' ? 'متجر إلكتروني' : 'E-commerce Store'}</SelectItem>
                  <SelectItem value="education">{language === 'ar' ? 'منصة تعليمية' : 'Educational Platform'}</SelectItem>
                  <SelectItem value="corporate">{language === 'ar' ? 'موقع شركة' : 'Company Website'}</SelectItem>
                  <SelectItem value="blog">{language === 'ar' ? 'مدونة / مجلة' : 'Blog / Magazine'}</SelectItem>
                  <SelectItem value="landing">{language === 'ar' ? 'صفحة هبوط' : 'Landing Page'}</SelectItem>
                  <SelectItem value="other">{language === 'ar' ? 'أخرى' : 'Other'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'الألوان المفضلة' : 'Preferred Colors'}</Label>
              <Input
                value={projectData.preferredColors}
                onChange={(e) => handleInputChange('preferredColors', e.target.value)}
                placeholder={language === 'ar' ? 'مثال: أزرق، أبيض، رمادي' : 'Example: Blue, White, Gray'}
              />
            </div>
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'الخطوط المفضلة' : 'Preferred Fonts'}</Label>
              <Select value={projectData.fonts} onValueChange={(value) => handleInputChange('fonts', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={language === 'ar' ? 'اختر الخط' : 'Select font'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">{language === 'ar' ? 'افتراضي' : 'Default'}</SelectItem>
                  <SelectItem value="modern">{language === 'ar' ? 'حديث' : 'Modern'}</SelectItem>
                  <SelectItem value="classic">{language === 'ar' ? 'كلاسيكي' : 'Classic'}</SelectItem>
                  <SelectItem value="elegant">{language === 'ar' ? 'أنيق' : 'Elegant'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'مواقع مشابهة للإلهام' : 'Inspiration Websites'}</Label>
              <Textarea
                value={projectData.inspirationWebsites}
                onChange={(e) => handleInputChange('inspirationWebsites', e.target.value)}
                placeholder={language === 'ar' ? 'أضف روابط مواقع تعجبك' : 'Add links to websites you like'}
                rows={3}
              />
            </div>
          </div>
        );

      case 3:
        const contentSections = [
          { id: 'home', label: language === 'ar' ? 'الرئيسية' : 'Home' },
          { id: 'about', label: language === 'ar' ? 'من نحن' : 'About Us' },
          { id: 'services', label: language === 'ar' ? 'الخدمات / المنتجات' : 'Services / Products' },
          { id: 'portfolio', label: language === 'ar' ? 'معرض أعمال' : 'Portfolio' },
          { id: 'blog', label: language === 'ar' ? 'المدونة' : 'Blog' },
          { id: 'contact', label: language === 'ar' ? 'تواصل معنا' : 'Contact Us' },
          { id: 'faq', label: language === 'ar' ? 'الأسئلة الشائعة' : 'FAQ' }
        ];

        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'الأقسام المطلوبة' : 'Required Sections'}</Label>
              <div className="grid grid-cols-2 gap-2">
                {contentSections.map((section) => (
                  <div key={section.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={section.id}
                      checked={projectData.sections.includes(section.id)}
                      onCheckedChange={() => handleArrayToggle('sections', section.id)}
                    />
                    <Label htmlFor={section.id} className="text-sm">{section.label}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'المحتوى المبدئي' : 'Initial Content'}</Label>
              <Textarea
                value={projectData.initialContent}
                onChange={(e) => handleInputChange('initialContent', e.target.value)}
                placeholder={language === 'ar' ? 'اكتب أو الصق المحتوى المتوفر' : 'Write or paste available content'}
                rows={4}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="needsReadyContent"
                checked={projectData.needsReadyContent}
                onCheckedChange={(checked) => handleInputChange('needsReadyContent', checked)}
              />
              <Label htmlFor="needsReadyContent">
                {language === 'ar' ? 'أحتاج محتوى جاهز' : 'I need ready-made content'}
              </Label>
            </div>
          </div>
        );

      case 9:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">{language === 'ar' ? 'ملخص المشروع' : 'Project Summary'}</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">{language === 'ar' ? 'اسم المشروع' : 'Project Name'}</Label>
                  <p className="text-muted-foreground">{projectData.name}</p>
                </div>
                <div>
                  <Label className="font-medium">{language === 'ar' ? 'الهدف' : 'Goal'}</Label>
                  <p className="text-muted-foreground">{projectData.goal}</p>
                </div>
              </div>
              <div>
                <Label className="font-medium">{language === 'ar' ? 'الوصف' : 'Description'}</Label>
                <p className="text-muted-foreground">{projectData.description}</p>
              </div>
              <div>
                <Label className="font-medium">{language === 'ar' ? 'الأقسام المطلوبة' : 'Required Sections'}</Label>
                <p className="text-muted-foreground">{projectData.sections.join(', ')}</p>
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
        <h2 className="text-2xl font-bold">{language === 'ar' ? 'مشروع جديد' : 'New Project'}</h2>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
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
              <div className={`w-12 h-0.5 mx-2 ${
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
          <Button onClick={handleSubmit} disabled={loading || !projectData.name || !projectData.description}>
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