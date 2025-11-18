'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

export function HeroBanner() {
  const t = useTranslations('home');
  const router = useRouter();
  const locale = useLocale();

  const handleOrder = () => {
    router.push(`/${locale}/products`);
  };

  return (
    <div className="relative w-full h-screen min-h-[500px] sm:min-h-[600px] overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/firstScreen.png"
          alt="NUVIA"
          fill
          className="object-top"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      
      <div className="relative z-10 h-full flex flex-col items-center justify-start text-center px-4 sm:px-6 pt-8 sm:pt-12 md:pt-32">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 animate-fade-in">
          {t('welcome')}
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-8 max-w-3xl animate-fade-in-delay">
          {t('slogan')}
        </p>
        <button
          onClick={handleOrder}
          className="px-8 sm:px-10 py-3 sm:py-4 bg-white text-black font-bold text-base sm:text-lg rounded-lg hover:bg-gray-200 hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in-delay-2"
        >
          {t('orderButton')}
        </button>
      </div>

      {/* Styles */}
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in 1s ease-out 0.3s both;
        }

        .animate-fade-in-delay-2 {
          animation: fade-in 1s ease-out 0.6s both;
        }
      `}</style>
    </div>
  );
}

