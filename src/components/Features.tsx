import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Database, 
  BarChart3, 
  FileText, 
  Package, 
  Plus, 
  Palette, 
  Users 
} from 'lucide-react';

const Features = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Database,
      titleKey: 'feature.datacenter.title',
      descriptionKey: 'feature.datacenter.description',
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      icon: BarChart3,
      titleKey: 'feature.tracker.title',
      descriptionKey: 'feature.tracker.description',
      gradient: 'from-green-500 to-teal-600'
    },
    {
      icon: FileText,
      titleKey: 'feature.templates.title',
      descriptionKey: 'feature.templates.description',
      gradient: 'from-orange-500 to-red-600'
    },
    {
      icon: Package,
      titleKey: 'feature.configurator.title',
      descriptionKey: 'feature.configurator.description',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      icon: Plus,
      titleKey: 'feature.addons.title',
      descriptionKey: 'feature.addons.description',
      gradient: 'from-indigo-500 to-blue-600'
    },
    {
      icon: Palette,
      titleKey: 'feature.content.title',
      descriptionKey: 'feature.content.description',
      gradient: 'from-yellow-500 to-orange-600'
    },
    {
      icon: Users,
      titleKey: 'feature.referral.title',
      descriptionKey: 'feature.referral.description',
      gradient: 'from-emerald-500 to-green-600'
    }
  ];

  return (
    <section id="features" className="py-24 bg-background-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t('features.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            
            return (
              <div
                key={feature.titleKey}
                className="relative bg-card/40 backdrop-blur-xl border border-border/50 rounded-xl p-8 hover-lift group animate-slide-up shadow-medium hover:shadow-large transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Icon */}
                <div className="w-16 h-16 rounded-xl bg-primary/10 border border-primary/20 p-4 mb-6 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                  <Icon className="w-8 h-8 text-primary" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-4">
                  {t(feature.titleKey)}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {t(feature.descriptionKey)}
                </p>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <p className="text-muted-foreground mb-6">
            And much more to accelerate your business growth
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="px-6 py-3 bg-primary/10 rounded-full text-primary font-medium">
              Real-time Analytics
            </div>
            <div className="px-6 py-3 bg-primary/10 rounded-full text-primary font-medium">
              API Integration
            </div>
            <div className="px-6 py-3 bg-primary/10 rounded-full text-primary font-medium">
              24/7 Support
            </div>
            <div className="px-6 py-3 bg-primary/10 rounded-full text-primary font-medium">
              Cloud Storage
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;