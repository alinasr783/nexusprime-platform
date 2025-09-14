import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Eye, EyeOff, ArrowLeft, Sun, Moon, Globe } from 'lucide-react';

const Signup = () => {
  const { t, toggleLanguage, language } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Insert into client table
      const { data, error } = await supabase
        .from('client')
        .insert([{ email, password }])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          toast.error(language === 'ar' ? 'هذا البريد الإلكتروني مسجل بالفعل' : 'This email is already registered');
        } else {
          toast.error(language === 'ar' ? 'حدث خطأ في التسجيل' : 'Registration failed');
        }
        return;
      }

      // Store user data in localStorage for session management
      localStorage.setItem('user', JSON.stringify(data));
      
      toast.success(language === 'ar' ? 'تم إنشاء الحساب بنجاح!' : 'Account created successfully!');
      
      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);

    } catch (error) {
      toast.error(language === 'ar' ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      {/* Header with controls */}
      <div className="fixed top-4 left-4 right-4 flex justify-between items-center z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.location.href = '/'}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
        </Button>
        
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-primary/5 transition-colors"
            title={theme === 'dark' ? (language === 'ar' ? 'الوضع المضيء' : 'Light Mode') : (language === 'ar' ? 'الوضع المظلم' : 'Dark Mode')}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          
          <button
            onClick={toggleLanguage}
            className="p-2 rounded-lg hover:bg-primary/5 transition-colors"
            title={language === 'ar' ? 'English' : 'العربية'}
          >
            <Globe className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Card className="w-full max-w-md glass-card">
        <CardHeader className="text-center">
          <div className="text-2xl font-bold text-gradient mb-2">
            TrueFolio
          </div>
          <CardTitle className="text-2xl">
            {language === 'ar' ? 'إنشاء حساب جديد' : 'Create Account'}
          </CardTitle>
          <CardDescription>
            {language === 'ar' 
              ? 'أدخل بياناتك لإنشاء حساب والبدء في إدارة مشاريعك' 
              : 'Enter your details to create an account and start managing your projects'
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">
                {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">
                {language === 'ar' ? 'كلمة المرور' : 'Password'}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={language === 'ar' ? 'أدخل كلمة المرور' : 'Enter your password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background/50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
              variant="hero"
            >
              {loading 
                ? (language === 'ar' ? 'جاري الإنشاء...' : 'Creating...') 
                : (language === 'ar' ? 'إنشاء الحساب' : 'Create Account')
              }
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {language === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
              <button 
                onClick={() => window.location.href = '/login'}
                className="text-primary hover:underline font-medium"
              >
                {language === 'ar' ? 'تسجيل الدخول' : 'Sign in'}
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;