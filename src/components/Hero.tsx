import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, Play } from 'lucide-react';
import heroBackground from '@/assets/hero-bg.jpg';

const Hero = () => {
  const { t, isRTL } = useLanguage();

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 gradient-hero opacity-90" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center animate-fade-in">
          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            {t('hero.title')}
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 animate-slide-up ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <Button variant="hero" size="xl" className="group">
              {t('hero.cta.primary')}
              <ArrowRight className={`ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 ${isRTL ? 'rotate-180 mr-2 ml-0 group-hover:-translate-x-1' : ''}`} />
            </Button>
            
            <Button variant="heroSecondary" size="xl" className="group">
              <Play className={`mr-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110 ${isRTL ? 'ml-2 mr-0' : ''}`} />
              {t('hero.cta.secondary')}
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <p className="text-white/60 text-sm mb-8">
              Trusted by 10,000+ businesses worldwide
            </p>
            
            {/* Logo Placeholder Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 items-center opacity-60">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-12 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm"
                >
                  <div className="text-white/80 font-semibold text-sm">
                    Logo {i}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;