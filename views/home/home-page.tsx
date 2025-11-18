'use client';

import { HeroBanner } from '@/widgets/hero-banner';
import { HeroSlider } from '@/widgets/hero-slider';

export function HomePage() {
  return (
    <>
      <HeroBanner />
      {/* Gradient transition between banner and slider */}
      <div className="relative w-full h-32 sm:h-40 md:h-48 bg-gradient-to-b from-transparent via-black/60 to-black">
        {/* Decorative line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent animate-fade-in-delay" />
      </div>
      <HeroSlider />
    </>
  );
}

export default HomePage;

