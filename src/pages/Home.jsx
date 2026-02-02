import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import ServicesSection from '@/components/home/ServicesSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import FeaturedItems from '@/components/home/FeaturedItems';
import CTASection from '@/components/home/CTASection';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <ServicesSection />
      <FeaturedItems />
      <HowItWorksSection />
      <CTASection />
    </div>
  );
}