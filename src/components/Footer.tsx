import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Twitter, 
  Facebook, 
  Linkedin, 
  Instagram, 
  Github,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  const { t, isRTL } = useLanguage();

  const quickLinks = [
    { key: 'nav.features', href: '#features' },
    { key: 'nav.pricing', href: '#pricing' },
    { key: 'nav.about', href: '#about' },
    { key: 'nav.contact', href: '#contact' }
  ];

  const legalLinks = [
    { key: 'footer.privacy', href: '#' },
    { key: 'footer.terms', href: '#' }
  ];

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Github, href: '#', label: 'GitHub' }
  ];

  return (
    <footer className="bg-foreground text-background">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-4">
              Stay Updated
            </h3>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              Get the latest updates, tips, and exclusive offers delivered to your inbox.
            </p>
            
            <div className={`flex flex-col sm:flex-row max-w-md mx-auto gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 flex-1"
              />
              <Button variant="hero" className="bg-white text-foreground hover:bg-white/90">
                <span>Subscribe</span>
                <ArrowRight className={`ml-2 h-4 w-4 ${isRTL ? 'rotate-180 mr-2 ml-0' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="text-3xl font-bold mb-4">
              NexusPrime
            </div>
            <p className="text-white/80 mb-6 max-w-md leading-relaxed">
              {t('footer.description')}
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300"
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">
              {t('footer.links')}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <a
                    href={link.href}
                    className="text-white/80 hover:text-white transition-colors duration-300"
                  >
                    {t(link.key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-6">
              {t('footer.legal')}
            </h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.key}>
                  <a
                    href={link.href}
                    className="text-white/80 hover:text-white transition-colors duration-300"
                  >
                    {t(link.key)}
                  </a>
                </li>
              ))}
            </ul>
            
            {/* Additional Links */}
            <ul className="space-y-3 mt-6">
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors duration-300">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors duration-300">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors duration-300">
                  API Documentation
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white/60 text-sm">
              {t('footer.rights')}
            </p>
            
            <div className="flex items-center space-x-6 text-sm text-white/60">
              <span>Made with ❤️ for modern businesses</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;