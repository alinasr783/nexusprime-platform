import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Check } from 'lucide-react';

const Pricing = () => {
  const { t } = useLanguage();
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for small teams getting started',
      monthlyPrice: 29,
      yearlyPrice: 290,
      popular: false,
      features: [
        '5 Projects',
        '10GB Storage',
        'Basic Templates',
        'Email Support',
        'Standard Analytics'
      ]
    },
    {
      name: 'Professional',
      description: 'Best for growing businesses',
      monthlyPrice: 79,
      yearlyPrice: 790,
      popular: true,
      features: [
        'Unlimited Projects',
        '100GB Storage',
        'Premium Templates',
        'Priority Support',
        'Advanced Analytics',
        'Custom Branding',
        'API Access'
      ]
    },
    {
      name: 'Enterprise',
      description: 'For large organizations',
      monthlyPrice: 199,
      yearlyPrice: 1990,
      popular: false,
      features: [
        'Everything in Professional',
        'Unlimited Storage',
        'Custom Templates',
        'Dedicated Support',
        'White-label Solution',
        'Advanced Security',
        'Custom Integrations',
        'SLA Guarantee'
      ]
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-background-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t('pricing.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            {t('pricing.subtitle')}
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-muted rounded-lg p-1">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                !isYearly
                  ? 'bg-background text-foreground shadow-soft'
                  : 'text-muted-foreground'
              }`}
            >
              {t('pricing.monthly')}
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                isYearly
                  ? 'bg-background text-foreground shadow-soft'
                  : 'text-muted-foreground'
              }`}
            >
              {t('pricing.yearly')}
              <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
            const monthlyPrice = isYearly ? Math.round(plan.yearlyPrice / 12) : plan.monthlyPrice;
            
            return (
              <div
                key={plan.name}
                className={`relative glass-card p-8 hover-lift animate-slide-up ${
                  plan.popular ? 'ring-2 ring-primary shadow-glow' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {plan.description}
                  </p>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-foreground">
                      ${monthlyPrice}
                    </span>
                    <span className="text-muted-foreground">
                      /month
                    </span>
                    {isYearly && (
                      <div className="text-sm text-muted-foreground">
                        Billed annually (${price})
                      </div>
                    )}
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  variant={plan.popular ? 'hero' : 'outline'}
                  size="lg"
                  className="w-full"
                >
                  {t('pricing.cta')}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Bottom Note */}
        <div className="text-center mt-16 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <p className="text-muted-foreground">
            14-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;