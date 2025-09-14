import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import Features from './Features';
import HowItWorks from './HowItWorks';
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
      <HowItWorks />
      <Pricing />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  );
};

export default LandingPage;