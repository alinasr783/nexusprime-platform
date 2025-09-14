import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { UserPlus, Download, Rocket } from 'lucide-react';

const HowItWorks = () => {
  const { t, isRTL } = useLanguage();

  const steps = [
    {
      icon: UserPlus,
      titleKey: 'how.step1.title',
      descriptionKey: 'how.step1.description',
      number: 1,
      color: 'from-blue-500 to-purple-600'
    },
    {
      icon: Download,
      titleKey: 'how.step2.title',
      descriptionKey: 'how.step2.description',
      number: 2,
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: Rocket,
      titleKey: 'how.step3.title',
      descriptionKey: 'how.step3.description',
      number: 3,
      color: 'from-pink-500 to-red-600'
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t('how.title')}
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;
            
            return (
              <div key={step.number} className="relative">
                {/* Connecting Line */}
                {!isLast && (
                  <div className={`hidden md:block absolute top-16 ${isRTL ? 'right-0' : 'left-full'} w-full h-0.5 bg-gradient-to-r from-primary to-primary/20 transform ${isRTL ? 'rotate-180' : ''}`} />
                )}

                {/* Step Card */}
                <div className="text-center group animate-slide-up" style={{ animationDelay: `${index * 0.2}s` }}>
                  {/* Step Number */}
                  <div className="relative mb-6">
                    <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${step.color} p-8 group-hover:scale-110 transition-transform duration-300 shadow-large`}>
                      <Icon className="w-16 h-16 text-white mx-auto" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold shadow-medium">
                      {step.number}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-foreground mb-4">
                    {t(step.titleKey)}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                    {t(step.descriptionKey)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Text */}
        <div className="text-center mt-16 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <p className="text-lg text-muted-foreground mb-8">
            Get started in minutes, not hours
          </p>
          <div className="inline-flex items-center space-x-2 text-primary font-medium">
            <span>Average setup time: 5 minutes</span>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;