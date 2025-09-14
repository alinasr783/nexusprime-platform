import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Eye, 
  Download, 
  MessageCircle, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Palette, 
  Code, 
  CreditCard, 
  Plus, 
  Star,
  Globe,
  FileText,
  Link as LinkIcon,
  Upload,
  Send,
  Settings,
  Zap
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  goal: string;
  status: string;
  progress: number;
  created_at: string;
  updated_at: string;
  project_data: any;
}

const ProjectView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { theme } = useTheme();
  const { toast } = useToast();
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setProject(data);
      } catch (error: any) {
        toast({
          title: language === 'ar' ? 'خطأ' : 'Error',
          description: error.message,
          variant: 'destructive'
        });
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, navigate, toast, language]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">
            {language === 'ar' ? 'المشروع غير موجود' : 'Project not found'}
          </h2>
          <Button onClick={() => navigate('/dashboard')}>
            {language === 'ar' ? 'العودة للوحة التحكم' : 'Back to Dashboard'}
          </Button>
        </Card>
      </div>
    );
  }

  const getStatusConfig = (status: string) => {
    const configs = {
      new: { 
        variant: 'secondary' as const, 
        label: language === 'ar' ? 'جديد' : 'New',
        color: 'bg-blue-500',
        icon: Clock
      },
      in_progress: { 
        variant: 'default' as const, 
        label: language === 'ar' ? 'قيد التنفيذ' : 'In Progress',
        color: 'bg-yellow-500',
        icon: Code
      },
      review: { 
        variant: 'outline' as const, 
        label: language === 'ar' ? 'مراجعة' : 'Under Review',
        color: 'bg-purple-500',
        icon: Eye
      },
      completed: { 
        variant: 'default' as const, 
        label: language === 'ar' ? 'مكتمل' : 'Completed',
        color: 'bg-green-500',
        icon: CheckCircle
      }
    };
    return configs[status as keyof typeof configs] || configs.new;
  };

  const statusConfig = getStatusConfig(project.status);
  const StatusIcon = statusConfig.icon;

  const milestones = [
    { id: 1, title: language === 'ar' ? 'تجميع البيانات' : 'Data Collection', completed: true },
    { id: 2, title: language === 'ar' ? 'التصميم المبدئي' : 'Initial Design', completed: true },
    { id: 3, title: language === 'ar' ? 'التطوير' : 'Development', completed: project.progress > 40 },
    { id: 4, title: language === 'ar' ? 'الاختبار' : 'Testing', completed: project.progress > 70 },
    { id: 5, title: language === 'ar' ? 'التسليم النهائي' : 'Final Delivery', completed: project.status === 'completed' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="hover:bg-accent/50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {language === 'ar' ? 'العودة' : 'Back'}
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${statusConfig.color} animate-pulse`}></div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {project.name}
                </h1>
                <Badge variant={statusConfig.variant} className="animate-fade-in">
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusConfig.label}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Globe className="h-4 w-4 mr-2" />
                {language === 'ar' ? 'معاينة' : 'Preview'}
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                <Settings className="h-4 w-4 mr-2" />
                {language === 'ar' ? 'إدارة' : 'Manage'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Overview Section */}
            <Card className="overflow-hidden border-0 bg-gradient-to-br from-card via-card to-accent/10 shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl font-bold flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center">
                        <Code className="h-6 w-6 text-white" />
                      </div>
                      {project.name}
                    </CardTitle>
                    <CardDescription className="text-base max-w-2xl">
                      {project.description}
                    </CardDescription>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {language === 'ar' ? 'بدء:' : 'Started:'} {new Date(project.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        {project.goal}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">{language === 'ar' ? 'التقدم الإجمالي' : 'Overall Progress'}</span>
                      <span className="text-sm font-bold text-primary">{project.progress}%</span>
                    </div>
                    <div className="relative">
                      <Progress value={project.progress} className="h-3 bg-gradient-to-r from-accent to-accent/50" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline Section */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  {language === 'ar' ? 'الجدول الزمني' : 'Project Timeline'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {milestones.map((milestone, index) => (
                    <div key={milestone.id} className="flex items-center gap-4 group">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                        ${milestone.completed 
                          ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg' 
                          : 'bg-muted text-muted-foreground group-hover:bg-accent'
                        }
                      `}>
                        {milestone.completed ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <span className="text-xs font-bold">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium transition-colors ${
                          milestone.completed ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {milestone.title}
                        </p>
                      </div>
                      {milestone.completed && (
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          {language === 'ar' ? 'مكتمل' : 'Completed'}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tabs Section */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 bg-muted/50 p-1 rounded-xl">
                <TabsTrigger value="details" className="rounded-lg transition-all">
                  <Palette className="h-4 w-4 mr-2" />
                  {language === 'ar' ? 'التفاصيل' : 'Details'}
                </TabsTrigger>
                <TabsTrigger value="files" className="rounded-lg transition-all">
                  <FileText className="h-4 w-4 mr-2" />
                  {language === 'ar' ? 'الملفات' : 'Files'}
                </TabsTrigger>
                <TabsTrigger value="communication" className="rounded-lg transition-all">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {language === 'ar' ? 'التواصل' : 'Communication'}
                </TabsTrigger>
                <TabsTrigger value="billing" className="rounded-lg transition-all">
                  <CreditCard className="h-4 w-4 mr-2" />
                  {language === 'ar' ? 'الفواتير' : 'Billing'}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>{language === 'ar' ? 'تفاصيل المشروع' : 'Project Details'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-primary">{language === 'ar' ? 'الهوية البصرية' : 'Brand Identity'}</h4>
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border-2 border-white shadow-lg"></div>
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-500 border-2 border-white shadow-lg"></div>
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 border-2 border-white shadow-lg"></div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-semibold text-primary">{language === 'ar' ? 'أقسام الموقع' : 'Website Sections'}</h4>
                        <div className="flex flex-wrap gap-2">
                          {['Home', 'About', 'Services', 'Contact', 'Blog'].map((section) => (
                            <Badge key={section} variant="outline" className="bg-accent/20">
                              {section}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="files" className="space-y-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{language === 'ar' ? 'ملفات المشروع' : 'Project Files'}</CardTitle>
                    <Button size="sm" variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      {language === 'ar' ? 'رفع ملف' : 'Upload File'}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { name: 'Logo.png', size: '2.4 MB', type: 'image' },
                        { name: 'Brand Guidelines.pdf', size: '1.8 MB', type: 'pdf' },
                        { name: 'Wireframes.fig', size: '5.2 MB', type: 'design' },
                        { name: 'Content.docx', size: '890 KB', type: 'document' }
                      ].map((file, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                          <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent/70 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{file.name}</p>
                            <p className="text-sm text-muted-foreground">{file.size}</p>
                          </div>
                          <Button size="sm" variant="ghost">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="communication" className="space-y-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>{language === 'ar' ? 'مركز التواصل' : 'Communication Center'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ScrollArea className="h-64 p-4 border rounded-lg bg-accent/10">
                      <div className="space-y-4">
                        {[
                          { user: 'Project Manager', message: 'Initial design mockups are ready for review', time: '2 hours ago', isClient: false },
                          { user: 'You', message: 'Looks great! Can we adjust the header color?', time: '1 hour ago', isClient: true },
                          { user: 'Designer', message: 'Absolutely! I\'ll update it within the day', time: '30 minutes ago', isClient: false }
                        ].map((msg, index) => (
                          <div key={index} className={`flex gap-3 ${msg.isClient ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs lg:max-w-md p-3 rounded-2xl ${
                              msg.isClient 
                                ? 'bg-primary text-primary-foreground ml-auto' 
                                : 'bg-muted'
                            }`}>
                              <p className="text-sm font-medium mb-1">{msg.user}</p>
                              <p className="text-sm">{msg.message}</p>
                              <p className={`text-xs mt-1 ${msg.isClient ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                {msg.time}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <div className="flex gap-2">
                      <input 
                        className="flex-1 px-3 py-2 border rounded-lg bg-background" 
                        placeholder={language === 'ar' ? 'اكتب رسالتك...' : 'Type your message...'} 
                      />
                      <Button size="sm">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="billing" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-green-600">{language === 'ar' ? 'حالة الدفع' : 'Payment Status'}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>{language === 'ar' ? 'المبلغ الإجمالي' : 'Total Amount'}</span>
                        <span className="font-bold">$2,500</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{language === 'ar' ? 'المدفوع' : 'Paid'}</span>
                        <span className="text-green-600 font-bold">$1,500</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{language === 'ar' ? 'المتبقي' : 'Remaining'}</span>
                        <span className="text-orange-600 font-bold">$1,000</span>
                      </div>
                      <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                        {language === 'ar' ? 'دفع المبلغ المتبقي' : 'Pay Remaining Amount'}
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>{language === 'ar' ? 'الإضافات المتاحة' : 'Available Add-ons'}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        { name: 'SEO Package', price: '$200', icon: Zap },
                        { name: 'Content Writing', price: '$300', icon: FileText },
                        { name: 'Maintenance Plan', price: '$50/month', icon: Settings }
                      ].map((addon, index) => {
                        const AddonIcon = addon.icon;
                        return (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
                                <AddonIcon className="h-4 w-4 text-white" />
                              </div>
                              <span className="font-medium">{addon.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-primary font-bold">{addon.price}</span>
                              <Button size="sm" variant="outline">
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Live Status */}
            <Card className="border-0 bg-gradient-to-br from-accent/20 to-accent/10 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  {language === 'ar' ? 'الحالة المباشرة' : 'Live Status'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {project.status === 'in_progress' ? 'Development' : statusConfig.label}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'المرحلة الحالية' : 'Current Phase'}
                  </div>
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/api/placeholder/32/32" />
                      <AvatarFallback>PM</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Sarah Johnson</p>
                      <p className="text-xs text-muted-foreground">{language === 'ar' ? 'مدير المشروع' : 'Project Manager'}</p>
                    </div>
                  </div>
                  <div className="text-sm p-2 bg-accent/30 rounded-lg">
                    <p className="font-medium">{language === 'ar' ? 'الخطوة التالية:' : 'Next Step:'}</p>
                    <p className="text-muted-foreground">{language === 'ar' ? 'رفع نسخة تجريبية' : 'Upload staging version'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Globe className="h-4 w-4 mr-2" />
                  {language === 'ar' ? 'عرض النسخة التجريبية' : 'View Staging Site'}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {language === 'ar' ? 'تواصل مع الفريق' : 'Contact Team'}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  {language === 'ar' ? 'تحميل التقرير' : 'Download Report'}
                </Button>
              </CardContent>
            </Card>

            {/* Project Stats */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{language === 'ar' ? 'إحصائيات المشروع' : 'Project Stats'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">12</div>
                    <div className="text-xs text-muted-foreground">{language === 'ar' ? 'صفحة' : 'Pages'}</div>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">8</div>
                    <div className="text-xs text-muted-foreground">{language === 'ar' ? 'ميزة' : 'Features'}</div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{language === 'ar' ? 'بداية المشروع' : 'Project Start'}</span>
                    <span className="text-muted-foreground">{new Date(project.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === 'ar' ? 'آخر تحديث' : 'Last Update'}</span>
                    <span className="text-muted-foreground">{new Date(project.updated_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === 'ar' ? 'التسليم المتوقع' : 'Expected Delivery'}</span>
                    <span className="text-primary font-medium">{language === 'ar' ? '15 يوم' : '15 days'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectView;