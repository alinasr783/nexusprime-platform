import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import Features from './Features';
import HowItWorksNew from './HowItWorksNew';
import Pricing from './Pricing';
import FAQ from './FAQ';
import Contact from './Contact';
import Footer from './Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <section id="hero">
        <Hero />
      </section>
      <section id="features">
        <Features />
      </section>
      <HowItWorksNew />
      <section id="pricing">
        <Pricing />
      </section>
      <section id="faq">
        <FAQ />
      </section>
      <section id="contact">
        <Contact />
      </section>
      <Footer />
    </div>
  );
};

export default LandingPage;