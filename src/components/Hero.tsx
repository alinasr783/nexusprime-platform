import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, Play, Bot, Zap, Globe } from 'lucide-react';
import heroRobot from '@/assets/hero-robot.jpg';

const Hero = () => {
  const { t, isRTL } = useLanguage();

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--primary)/0.1) 50%, hsl(var(--background)) 100%), url(${heroRobot})`,
        backgroundSize: 'cover, contain',
        backgroundPosition: 'center, right center',
        backgroundRepeat: 'no-repeat, no-repeat',
        backgroundBlendMode: 'overlay'
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
      
      {/* Animated Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10 animate-pulse" />
      
      {/* Floating Elements */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-1/3 left-1/2 w-24 h-24 bg-accent/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-4xl">
          
          {/* Text Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="animate-fade-in">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium text-sm mb-6">
                <Bot className="w-4 h-4" />
                TrueFolio Platform
              </div>
              
              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                {t('hero.title')}
              </h1>

              {/* Subheadline */}
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto lg:mx-0">
                {t('hero.subtitle')}
              </p>

              {/* CTA Buttons */}
              <div className={`flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-slide-up ${isRTL ? 'sm:flex-row-reverse lg:justify-end' : ''}`}>
                <Button size="xl" className="group bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto">
                  {t('hero.cta.primary')}
                  <ArrowRight className={`ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 ${isRTL ? 'rotate-180 mr-2 ml-0 group-hover:-translate-x-1' : ''}`} />
                </Button>
                
                <Button variant="outline" size="xl" className="group border-2 border-primary/20 bg-background/80 hover:bg-primary/5 hover:border-primary/30 w-full sm:w-auto">
                  <Play className={`mr-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110 ${isRTL ? 'ml-2 mr-0' : ''}`} />
                  {t('hero.cta.secondary')}
                </Button>
              </div>

              {/* Features Highlights */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 mt-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                {[
                  { icon: Zap, text: t('hero.features.realtime') || 'Real-time Tracking' },
                  { icon: Bot, text: t('hero.features.ai') || 'AI-Powered' },
                  { icon: Globe, text: t('hero.features.global') || 'Global Access' }
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-muted-foreground">
                    <feature.icon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;