import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Home,
  Search,
  Bell,
  Sun,
  Moon,
  Globe,
  ArrowLeft
} from 'lucide-react';

interface DashboardHeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  showBackButton = false,
  onBackClick
}) => {
  const { language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b border-border p-4 bg-background/95 backdrop-blur-sm sticky top-0 z-40">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackClick || (() => window.history.back())}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {language === 'ar' ? 'رجوع' : 'Back'}
            </Button>
          )}
          
          {!showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = '/'}
            >
              <Home className="h-4 w-4 mr-2" />
              {language === 'ar' ? 'الرئيسية' : 'Home'}
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.href = '/dashboard'}
          >
            {language === 'ar' ? 'الداشبورد' : 'Dashboard'}
          </Button>

          {title && (
            <>
              <span className="text-muted-foreground">/</span>
              <span className="font-medium">{title}</span>
            </>
          )}
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
  );
};