import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Save, Edit, Eye, EyeOff } from 'lucide-react';

interface EditAccountProps {
  user: any;
  onUserUpdate: (user: any) => void;
}

const EditAccount = ({ user, onUserUpdate }: EditAccountProps) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email || '',
    password: '',
    phone: user?.phone || ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updateData: any = {
        email: formData.email,
        phone: formData.phone
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const { data, error } = await supabase
        .from('client')
        .update(updateData)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      const updatedUser = { ...user, ...data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      onUserUpdate(updatedUser);
      setIsEditing(false);
      setFormData(prev => ({ ...prev, password: '' }));
      
      toast({
        title: language === 'ar' ? 'تم التحديث' : 'Updated Successfully',
        description: language === 'ar' ? 'تم تحديث بياناتك بنجاح' : 'Your information has been updated successfully',
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

  const handleCancel = () => {
    setFormData({
      email: user?.email || '',
      password: '',
      phone: user?.phone || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{language === 'ar' ? 'حسابي' : 'My Account'}</h2>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{language === 'ar' ? 'معلومات الحساب' : 'Account Information'}</CardTitle>
            {!isEditing && (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                {language === 'ar' ? 'تعديل' : 'Edit'}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</Label>
            {isEditing ? (
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder={language === 'ar' ? 'أدخل البريد الإلكتروني' : 'Enter email'}
              />
            ) : (
              <p className="text-muted-foreground px-3 py-2 bg-muted rounded-md">{user?.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{language === 'ar' ? 'رقم الموبايل' : 'Phone Number'}</Label>
            {isEditing ? (
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder={language === 'ar' ? 'أدخل رقم الموبايل' : 'Enter phone number'}
              />
            ) : (
              <p className="text-muted-foreground px-3 py-2 bg-muted rounded-md">
                {user?.phone || (language === 'ar' ? 'غير محدد' : 'Not specified')}
              </p>
            )}
          </div>

          {isEditing && (
            <div className="space-y-2">
              <Label htmlFor="password">{language === 'ar' ? 'كلمة مرور جديدة (اختياري)' : 'New Password (Optional)'}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder={language === 'ar' ? 'أدخل كلمة مرور جديدة' : 'Enter new password'}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>{language === 'ar' ? 'تاريخ الإنشاء' : 'Created Date'}</Label>
            <p className="text-muted-foreground px-3 py-2 bg-muted rounded-md">
              {new Date(user?.created_at).toLocaleDateString()}
            </p>
          </div>

          {isEditing && (
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (language === 'ar' ? 'حفظ' : 'Save')}
              </Button>
              <Button variant="outline" onClick={handleCancel} disabled={loading}>
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EditAccount;