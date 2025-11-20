'use client';

import { useTranslations } from 'next-intl';

export function GalleryPage() {
  const t = useTranslations('gallery');

  return (
    <div className="container mx-auto px-3 min-[375px]:px-4 sm:px-6 lg:px-8 xl:px-12 pt-16 min-[375px]:pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-8 sm:pb-16">
      <h1 className="text-2xl min-[375px]:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 min-[375px]:mb-4 lg:mb-6 text-white">{t('title')}</h1>
      <p className="text-base min-[375px]:text-lg sm:text-xl lg:text-2xl text-gray-400 mb-6 sm:mb-8 max-w-3xl">{t('description')}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 min-[375px]:gap-4 sm:gap-6">
        {/* Gallery items will go here */}
      </div>
    </div>
  );
}

export default GalleryPage;

