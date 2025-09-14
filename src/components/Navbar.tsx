import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Menu, X, Globe } from 'lucide-react';

const Navbar = () => {
  const { t, toggleLanguage, isRTL } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { key: 'nav.home', href: '#home' },
    { key: 'nav.features', href: '#features' },
    { key: 'nav.pricing', href: '#pricing' },
    { key: 'nav.about', href: '#about' },
    { key: 'nav.contact', href: '#contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="text-2xl font-bold text-gradient">
              NexusPrime
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                >
                  {t(item.key)}
                </a>
              ))}
            </div>
          </div>

          {/* Right side actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              <Globe className="h-4 w-4" />
              <span className="text-sm">{t('nav.language')}</span>
            </button>

            {/* Auth Buttons */}
            <Button variant="ghost" size="sm">
              {t('nav.login')}
            </Button>
            <Button variant="hero" size="sm">
              {t('nav.signup')}
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            {/* Mobile Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="text-muted-foreground hover:text-foreground"
            >
              <Globe className="h-5 w-5" />
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-foreground hover:text-primary"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-xl rounded-lg mt-2 border border-white/20 shadow-large">
              {navItems.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t(item.key)}
                </a>
              ))}
              <div className="border-t border-gray-200 pt-4 pb-3">
                <div className="flex flex-col space-y-2">
                  <Button variant="ghost" size="sm" className="justify-start">
                    {t('nav.login')}
                  </Button>
                  <Button variant="hero" size="sm">
                    {t('nav.signup')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;