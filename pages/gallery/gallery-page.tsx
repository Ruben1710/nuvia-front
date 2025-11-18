'use client';

import { useTranslations } from 'next-intl';

export function GalleryPage() {
  const t = useTranslations('gallery');

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-white">{t('title')}</h1>
      <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-6 sm:mb-8">{t('description')}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {/* Gallery items will go here */}
      </div>
    </div>
  );
}

export default GalleryPage;

