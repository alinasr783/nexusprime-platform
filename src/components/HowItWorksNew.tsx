import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Rocket, Upload, Settings, CheckCircle, ArrowRight, Zap, Bot, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HowItWorksNew = () => {
  const { t, isRTL } = useLanguage();

  const steps = [
    {
      icon: Upload,
      titleKey: 'how.step1.title',
      descriptionKey: 'how.step1.description',
      number: '01',
      gradient: 'from-blue-500 to-purple-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      icon: Settings,
      titleKey: 'how.step2.title',
      descriptionKey: 'how.step2.description',
      number: '02',
      gradient: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      icon: Rocket,
      titleKey: 'how.step3.title',
      descriptionKey: 'how.step3.description',
      number: '03',
      gradient: 'from-pink-500 to-orange-500',
      bgColor: 'bg-pink-500/10'
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-background via-primary/5 to-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            How It Works
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {t('how.title')}
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your ideas into reality in just three simple steps. Our AI-powered platform makes it effortless.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-10" />
          
          <div className="relative grid lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                
                {/* Connection Line (Desktop Only) */}
                {index < steps.length - 1 && (
                  <div className={`hidden lg:block absolute top-20 ${isRTL ? 'right-0' : 'left-full'} w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent transform ${isRTL ? 'rotate-180' : ''} z-10`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-transparent animate-pulse" />
                  </div>
                )}

                {/* Step Card */}
                <div className="relative">
                  {/* Floating Number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-white font-bold text-lg flex items-center justify-center shadow-lg z-20 animate-tech-pulse">
                    {step.number}
                  </div>

                  {/* Main Card */}
                  <div className={`group relative p-8 rounded-3xl border-2 border-border/50 bg-card/60 backdrop-blur-xl hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${step.bgColor}`}>
                    
                    {/* Glow Effect */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Icon Container */}
                    <div className="relative mb-6">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <step.icon className="w-8 h-8" />
                      </div>
                      
                      {/* Tech Particles */}
                      <div className="absolute -top-2 -right-2 w-3 h-3 bg-primary rounded-full animate-ping opacity-60" />
                      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-accent rounded-full animate-ping opacity-40" style={{ animationDelay: '1s' }} />
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                        {t(step.titleKey)}
                      </h3>
                      
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        {t(step.descriptionKey)}
                      </p>

                      {/* Action Indicators */}
                      <div className="flex items-center gap-3 text-sm text-primary">
                        <Zap className="w-4 h-4" />
                        <span className="font-medium">Instant Setup</span>
                        <Bot className="w-4 h-4 ml-2" />
                        <span className="font-medium">AI Powered</span>
                      </div>
                    </div>

                    {/* Interactive Elements */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowRight className="w-5 h-5 text-primary animate-bounce" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="inline-flex flex-col items-center gap-4 p-8 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Ready to get started?</span>
              </div>
              
              <p className="text-muted-foreground text-center max-w-md">
                Join thousands of businesses already transforming their workflow with TrueFolio
              </p>
              
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl group">
                Start Your Journey
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksNew;