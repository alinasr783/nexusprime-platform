import React from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  CheckCircle2,
  Clock,
  Calendar,
  User,
  FileText,
  Upload,
  MessageSquare,
  CreditCard,
  Plus,
  ExternalLink,
  Download,
  Eye,
  Settings,
  AlertCircle
} from 'lucide-react';

import { useProject } from '@/hooks/useProject';
import { usePricing } from '@/hooks/usePricing';
import { FileUpload } from '@/components/project/FileUpload';
import { PaymentSection } from '@/components/project/PaymentSection';
import { AddonsSection } from '@/components/project/AddonsSection';

const ProjectViewNew = () => {
  const { id } = useParams<{ id: string }>();
  
  const {
    project,
    files,
    payments,
    addons,
    loading: projectLoading,
    error,
    uploadFile,
    getFileUrl,
    refetch
  } = useProject(id!);

  const {
    pricingStructure,
    addonConfig,
    loading: pricingLoading,
    calculateProjectPrice,
    getProjectStats
  } = usePricing();

  if (!id) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">مشروع غير موجود</h1>
          <p className="text-muted-foreground">لم يتم العثور على المشروع المطلوب</p>
        </div>
      </div>
    );
  }

  if (projectLoading || pricingLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">خطأ في تحميل المشروع</h1>
          <p className="text-muted-foreground mb-4">
            {error || 'حدث خطأ غير متوقع'}
          </p>
          <Button onClick={refetch}>إعادة المحاولة</Button>
        </div>
      </div>
    );
  }

  const totalAmount = calculateProjectPrice(project.project_data);
  const projectStats = getProjectStats({
    ...project.project_data,
    created_at: project.created_at,
    updated_at: project.updated_at
  });

  // Timeline milestones
  const milestones = [
    { id: 1, title: 'تجميع البيانات', completed: true, date: '14/9/2025' },
    { id: 2, title: 'إعداد التصميم المبدئي', completed: true, date: '15/9/2025' },
    { id: 3, title: 'التطوير', completed: project.progress > 40, date: '20/9/2025' },
    { id: 4, title: 'الاختبار', completed: project.progress > 70, date: '25/9/2025' },
    { id: 5, title: 'التسليم النهائي', completed: project.status === 'completed', date: '30/9/2025' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Project Header */}
        <Card className="p-8 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="text-4xl">🚀</div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
                <p className="text-muted-foreground mb-4">{project.description}</p>
                <div className="flex items-center space-x-4 space-x-reverse">
                  <Badge variant="outline">{project.project_data?.websiteType || 'مخصص'}</Badge>
                  <Badge 
                    variant={project.status === 'completed' ? 'default' : 'secondary'}
                  >
                    {project.status === 'completed' ? 'مكتمل' : 
                     project.status === 'in_progress' ? 'قيد التطوير' : 
                     project.status === 'on_hold' ? 'معلق' : 'جديد'}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary mb-2">{project.progress}%</div>
              <Progress value={project.progress} className="w-32 mb-2" />
              <p className="text-sm text-muted-foreground">مكتمل</p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 rounded-lg bg-card">
                <div className="text-2xl font-bold text-primary">{projectStats.pages}</div>
                <div className="text-sm text-muted-foreground">صفحات</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-card">
                <div className="text-2xl font-bold text-primary">{projectStats.features}</div>
                <div className="text-sm text-muted-foreground">خصائص</div>
              </div>
            </div>

            {/* Timeline */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Calendar className="h-5 w-5 ml-2" />
                الجدول الزمني
              </h3>
              <div className="space-y-4">
                {milestones.map((milestone) => (
                  <div key={milestone.id} className="flex items-center space-x-4 space-x-reverse">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      milestone.completed 
                        ? 'bg-green-500 text-white' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {milestone.completed ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Clock className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${
                        milestone.completed ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {milestone.title}
                      </p>
                      <p className="text-sm text-muted-foreground">{milestone.date}</p>
                    </div>
                    {milestone.completed && (
                      <Badge variant="outline" className="text-green-600">
                        مكتمل
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Tabs for detailed content */}
            <Tabs defaultValue="details" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="details">التفاصيل</TabsTrigger>
                <TabsTrigger value="files">الملفات</TabsTrigger>
                <TabsTrigger value="communication">التواصل</TabsTrigger>
                <TabsTrigger value="billing">الفواتير</TabsTrigger>
                <TabsTrigger value="addons">الإضافات</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">تفاصيل المشروع</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2 text-primary">الهوية البصرية</h4>
                      <div className="flex space-x-2 space-x-reverse mb-4">
                        <div className="w-8 h-8 rounded-full bg-blue-500"></div>
                        <div className="w-8 h-8 rounded-full bg-green-500"></div>
                        <div className="w-8 h-8 rounded-full bg-purple-500"></div>
                      </div>
                      <p className="text-sm text-muted-foreground">الألوان الأساسية للمشروع</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-primary">أقسام الموقع</h4>
                      <div className="flex flex-wrap gap-2">
                        {['الرئيسية', 'من نحن', 'الخدمات', 'تواصل معنا', 'المدونة'].map((section, index) => (
                          <Badge key={index} variant="outline">{section}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="files" className="space-y-6">
                <FileUpload 
                  files={files}
                  onUpload={uploadFile}
                  onGetFileUrl={getFileUrl}
                />
              </TabsContent>

              <TabsContent value="communication" className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <MessageSquare className="h-5 w-5 ml-2" />
                    مركز التواصل
                  </h3>
                  <div className="space-y-4 mb-4 max-h-64 overflow-y-auto">
                    <div className="p-3 rounded-lg bg-muted">
                      <div className="flex items-center space-x-2 space-x-reverse mb-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>PM</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">مدير المشروع</span>
                        <span className="text-xs text-muted-foreground">منذ ساعتين</span>
                      </div>
                      <p className="text-sm">تم الانتهاء من التصميم المبدئي، يرجى المراجعة</p>
                    </div>
                    <div className="p-3 rounded-lg bg-primary text-primary-foreground mr-8">
                      <div className="flex items-center space-x-2 space-x-reverse mb-2">
                        <span className="text-sm font-medium">أنت</span>
                        <span className="text-xs text-primary-foreground/70">منذ ساعة</span>
                      </div>
                      <p className="text-sm">رائع! يمكن تعديل لون الهيدر؟</p>
                    </div>
                  </div>
                  <div className="flex space-x-2 space-x-reverse">
                    <input
                      type="text"
                      placeholder="اكتب رسالتك..."
                      className="flex-1 px-3 py-2 border rounded-lg bg-background"
                    />
                    <Button size="sm">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="billing" className="space-y-6">
                <PaymentSection 
                  payments={payments}
                  totalAmount={totalAmount}
                />
              </TabsContent>

              <TabsContent value="addons" className="space-y-6">
                <AddonsSection 
                  addons={addons}
                  addonConfig={addonConfig}
                  onAddAddon={(addonKey) => {
                    // Handle add addon functionality
                    console.log('Adding addon:', addonKey);
                  }}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Timeline Info */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">معلومات المشروع</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">بداية المشروع</span>
                  <span className="text-sm font-medium">{projectStats.startDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">آخر تحديث</span>
                  <span className="text-sm font-medium">{projectStats.lastUpdate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">التسليم المتوقع</span>
                  <span className="text-sm font-medium text-primary">{projectStats.expectedDelivery}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">إجمالي المشروع</span>
                  <span className="text-lg font-bold text-primary">{totalAmount.toLocaleString()} ج.م</span>
                </div>
              </div>
            </Card>

            {/* Live Status */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-2"></div>
                الحالة المباشرة
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-primary">المرحلة الحالية: التطوير</p>
                  <Progress value={40} className="mt-2" />
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>Dev</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">أحمد محمد</p>
                    <p className="text-xs text-muted-foreground">مطور المشروع</p>
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground">الخطوة التالية:</p>
                  <p className="text-sm font-medium">رفع نسخة تجريبية</p>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">إجراءات سريعة</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Eye className="h-4 w-4 ml-2" />
                  معاينة الموقع
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 ml-2" />
                  تحميل الملفات
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 ml-2" />
                  إعدادات المشروع
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectViewNew;