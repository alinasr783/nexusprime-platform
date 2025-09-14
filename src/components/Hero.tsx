import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, Play, Bot, Zap, Globe } from 'lucide-react';
import heroRobot from '@/assets/hero-robot.jpg';

const Hero = () => {
  const { t, isRTL } = useLanguage();

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 animate-pulse" />
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/3 left-1/2 w-24 h-24 bg-accent/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
        
        {/* Tech Particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-primary rounded-full animate-ping" style={{ animationDelay: '1s' }} />
        <div className="absolute top-40 right-32 w-1.5 h-1.5 bg-accent rounded-full animate-ping" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-32 left-1/3 w-2.5 h-2.5 bg-primary/70 rounded-full animate-ping" style={{ animationDelay: '5s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div className={`space-y-8 ${isRTL ? 'lg:order-2' : ''}`}>
            <div className="animate-fade-in">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium text-sm mb-6">
                <Bot className="w-4 h-4" />
                TrueFolio Platform
              </div>
              
              {/* Main Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                {t('hero.title')}
              </h1>

              {/* Subheadline */}
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                {t('hero.subtitle')}
              </p>

              {/* CTA Buttons */}
              <div className={`flex flex-col sm:flex-row items-start gap-4 animate-slide-up ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                <Button size="xl" className="group bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  {t('hero.cta.primary')}
                  <ArrowRight className={`ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 ${isRTL ? 'rotate-180 mr-2 ml-0 group-hover:-translate-x-1' : ''}`} />
                </Button>
                
                <Button variant="outline" size="xl" className="group border-2 hover:bg-primary/5">
                  <Play className={`mr-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110 ${isRTL ? 'ml-2 mr-0' : ''}`} />
                  {t('hero.cta.secondary')}
                </Button>
              </div>

              {/* Features Highlights */}
              <div className="flex flex-wrap gap-6 mt-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                {[
                  { icon: Zap, text: 'Real-time Tracking' },
                  { icon: Bot, text: 'AI-Powered' },
                  { icon: Globe, text: 'Global Access' }
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-muted-foreground">
                    <feature.icon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Robot Image */}
          <div className={`${isRTL ? 'lg:order-1' : ''} animate-fade-in`} style={{ animationDelay: '0.2s' }}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-3xl transform rotate-6" />
              <img 
                src={heroRobot} 
                alt="TrueFolio AI Platform" 
                className="relative w-full h-auto rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-500"
              />
              
              {/* Floating UI Elements */}
              <div className="absolute -top-4 -right-4 bg-card/80 backdrop-blur-sm border rounded-xl p-3 shadow-lg animate-float">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-xs font-medium text-foreground">Online</span>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-card/80 backdrop-blur-sm border rounded-xl p-3 shadow-lg animate-float" style={{ animationDelay: '2s' }}>
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-foreground">AI Assistant</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Trust Indicators */}
        <div className="mt-20 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <p className="text-center text-muted-foreground text-sm mb-8">
            {t('hero.trust')}
          </p>
          
          {/* Moving Logo Slider */}
          <div className="relative overflow-hidden">
            <div className={`flex items-center gap-8 animate-scroll ${isRTL ? 'animate-scroll-rtl' : 'animate-scroll-ltr'}`}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="flex-shrink-0 h-12 px-6 bg-card/60 backdrop-blur-sm border rounded-lg flex items-center justify-center shadow-sm"
                >
                  <div className="text-muted-foreground font-semibold text-sm">
                    {t('hero.logo')} {i}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;