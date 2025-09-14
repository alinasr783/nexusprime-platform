import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import EditAccount from '@/components/dashboard/EditAccount';
import ProjectsManager from '@/components/dashboard/ProjectsManager';
import { 
  User, 
  FolderOpen, 
  Users, 
  CreditCard, 
  Package, 
  BarChart3, 
  Palette, 
  Settings, 
  Plus, 
  LogOut,
  Sun,
  Moon,
  Globe,
  Home,
  Search,
  Bell,
  Download,
  Eye,
  Edit,
  MoreHorizontal
} from 'lucide-react';

const Dashboard = () => {
  const { language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('account');

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (!userData) {
      window.location.href = '/signup';
      return;
    }
    setUser(JSON.parse(userData));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const sidebarItems = [
    { id: 'account', icon: User, label: language === 'ar' ? 'حسابي' : 'My Account' },
    { id: 'projects', icon: FolderOpen, label: language === 'ar' ? 'مشاريعي' : 'My Projects' },
    { id: 'referral', icon: Users, label: language === 'ar' ? 'برنامج الإحالة' : 'Referral Program' },
    { id: 'billing', icon: CreditCard, label: language === 'ar' ? 'الفواتير والمدفوعات' : 'Billing & Payments' },
    { id: 'addons', icon: Package, label: language === 'ar' ? 'متجر الإضافات' : 'Add-ons Store' },
    { id: 'tracker', icon: BarChart3, label: language === 'ar' ? 'متابعة المشروع' : 'Project Tracker' },
    { id: 'templates', icon: Palette, label: language === 'ar' ? 'مكتبة القوالب' : 'Template Library' },
    { id: 'configurator', icon: Settings, label: language === 'ar' ? 'مخصص الباقات' : 'Package Configurator' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <EditAccount 
            user={user} 
            onUserUpdate={setUser}
          />
        );

      case 'projects':
        return (
          <ProjectsManager user={user} />
        );

      case 'referral':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">{language === 'ar' ? 'برنامج الإحالة' : 'Referral Program'}</h2>
            <Card>
              <CardHeader>
                <CardTitle>{language === 'ar' ? 'رابط الإحالة الخاص بك' : 'Your Referral Link'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value="https://truefolio.com/ref/abc123" 
                    readOnly 
                    className="flex-1 px-3 py-2 border rounded-md bg-muted"
                  />
                  <Button variant="outline">
                    {language === 'ar' ? 'نسخ' : 'Copy'}
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">12</div>
                    <div className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'إحالات' : 'Referrals'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">$240</div>
                    <div className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'عمولة' : 'Commission'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">$120</div>
                    <div className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'متاح للسحب' : 'Available'}
                    </div>
                  </div>
                </div>
                <Button className="w-full">
                  {language === 'ar' ? 'سحب الأرباح' : 'Withdraw Earnings'}
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">
              {sidebarItems.find(item => item.id === activeTab)?.label}
            </h2>
            <Card>
              <CardContent className="py-8">
                <div className="text-center text-muted-foreground">
                  {language === 'ar' ? 'هذا القسم قيد التطوير' : 'This section is under development'}
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border p-4">
        <div className="flex items-center gap-2 mb-8">
          <div className="text-xl font-bold text-gradient">TrueFolio</div>
        </div>
        
        <nav className="space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === item.id 
                  ? 'bg-primary/10 text-primary border border-primary/20' 
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="mt-8 pt-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-destructive/10 text-destructive transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-sm">{language === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="border-b border-border p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.href = '/'}
              >
                <Home className="h-4 w-4 mr-2" />
                {language === 'ar' ? 'الرئيسية' : 'Home'}
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button
                onClick={toggleLanguage}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Globe className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;