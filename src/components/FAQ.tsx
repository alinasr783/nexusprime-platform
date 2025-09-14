import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQ = () => {
  const { t } = useLanguage();

  const faqs = [
    {
      questionKey: 'faq.q1',
      answerKey: 'faq.a1'
    },
    {
      questionKey: 'faq.q2',
      answerKey: 'faq.a2'
    },
    {
      questionKey: 'faq.q3',
      answerKey: 'faq.a3'
    },
    {
      question: 'What integrations are supported?',
      answer: 'We support integrations with popular tools like Slack, Zapier, Google Workspace, Microsoft 365, and many more through our API.'
    },
    {
      question: 'Is there a mobile app?',
      answer: 'Our platform is fully responsive and works great on mobile browsers. Native mobile apps are coming soon.'
    },
    {
      question: 'Can I customize the platform for my brand?',
      answer: 'Yes! Professional and Enterprise plans include custom branding options, including your logo, colors, and domain.'
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t('faq.title')}
          </h2>
        </div>

        {/* FAQ Accordion */}
        <div className="animate-slide-up">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="glass-card px-6 border-none rounded-xl"
              >
                <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:text-primary hover:no-underline py-6">
                  {faq.questionKey ? t(faq.questionKey) : faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 text-base leading-relaxed">
                  {faq.answerKey ? t(faq.answerKey) : faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <p className="text-muted-foreground mb-6">
            Still have questions? We're here to help.
          </p>
          <div className="space-x-4">
            <a 
              href="#contact" 
              className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Contact Support →
            </a>
            <a 
              href="#" 
              className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Browse Help Center →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;