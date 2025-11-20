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
    <div className="relative w-full min-h-[270px] min-[375px]:min-h-[280px] sm:min-h-[550px] md:min-h-[500px] lg:min-h-[700px] xl:min-h-[800px] 2xl:min-h-[1150px] overflow-hidden">
      {/* <div className="absolute inset-0"> */}
        {/* <Image
          src="/images/firstScreen.png"
          alt="NUVIA"
          fill
          className="object-cover object-top"
          priority
          sizes="100vw"
        /> */}
        <Image
  src="/images/firstScreen.png"
  alt="NUVIA"
  width={1920}
  height={1150}
  className="w-full h-auto object-cover object-top absolute inset-0"
/>
        <div className="absolute inset-0 bg-black/40" />
      {/* </div> */}
      
      <div className="relative z-10 h-full flex flex-col items-center justify-start text-center px-3 min-[375px]:px-4 sm:px-6 lg:px-8 xl:px-12 pt-6 min-[375px]:pt-8 sm:pt-12 md:pt-24 lg:pt-32 xl:pt-40">
        <h1 className="text-3xl min-[375px]:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold text-white mb-3 min-[375px]:mb-4 sm:mb-6 lg:mb-8 animate-fade-in">
          {t('welcome')}
        </h1>
        <p className="text-base min-[375px]:text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/90 mb-4 min-[375px]:mb-6 sm:mb-8 lg:mb-10 max-w-4xl px-2 animate-fade-in-delay">
          {t('slogan')}
        </p>
        <button
          onClick={handleOrder}
          className="px-6 min-[375px]:px-8 sm:px-10 lg:px-12 xl:px-14 py-2.5 min-[375px]:py-3 sm:py-4 lg:py-5 bg-white text-black font-bold text-sm min-[375px]:text-base sm:text-lg lg:text-xl rounded-lg hover:bg-gray-200 hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in-delay-2"
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

