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
      <Hero />
      <Features />
      <HowItWorksNew />
      <Pricing />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  );
};

export default LandingPage;