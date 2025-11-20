'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { useWorksStore } from '@/shared/store/worksStore';
import { useCategoriesStore } from '@/shared/store/categoriesStore';
import { CategoryFilter } from '@/shared/ui/category-filter';
import { X } from 'lucide-react';

export function WorksPage() {
  const t = useTranslations('works');
  const locale = useLocale();
  const { works, loading, fetchWorks } = useWorksStore();
  const { categories, fetchCategories } = useCategoriesStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<{
    image: string;
    name: string;
    description: string;
    workId: number;
  } | null>(null);

  useEffect(() => {
    fetchWorks();
    fetchCategories();
  }, [fetchWorks, fetchCategories]);

  // Получаем все изображения из работ
  const getAllImages = () => {
    const allImages: Array<{
      image: string;
      name: string;
      description: string;
      workId: number;
      categorySlug: string;
    }> = [];

    works.forEach((work) => {
      // Находим категорию по slug для получения ID
      const category = categories.find((cat) => cat.slug === work.category);
      if (!category) return;

      // Фото работы
      if (work.photo) {
        const name = locale === 'en' ? work.title.en : locale === 'ru' ? work.title.ru : work.title.arm;
        const description = locale === 'en' ? work.description.en : locale === 'ru' ? work.description.ru : work.description.arm;
        allImages.push({
          image: work.photo,
          name: name || '',
          description: description || '',
          workId: work.id,
          categorySlug: work.category,
        });
      }
    });

    return allImages;
  };

  const allImages = getAllImages();
  const filteredImages = selectedCategory
    ? allImages.filter((img) => img.categorySlug === selectedCategory)
    : allImages;

  const handleImageClick = (image: typeof allImages[0]) => {
    setSelectedImage({
      image: image.image,
      name: image.name,
      description: image.description,
      workId: image.workId,
    });
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  // Закрытие модалки по Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    if (selectedImage) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="text-white text-center">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 md:py-16">
      {/* Header */}
      <div className="text-center mb-6 min-[375px]:mb-8 sm:mb-10">
        <h1 className="text-2xl min-[375px]:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white animate-fade-in px-2">
          {t('title')}
        </h1>
      </div>

      {/* Category Filter */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* Grid with equal sized cards */}
      {filteredImages.length === 0 ? (
        <div className="text-center text-gray-400 py-8 min-[375px]:py-10 sm:py-12 px-2">
          <p className="text-sm min-[375px]:text-base">{t('noImages')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 min-[375px]:gap-5 sm:gap-6 md:gap-8">
          {filteredImages.map((item, index) => (
            <div
              key={`${item.workId}-${index}`}
              className="group cursor-pointer relative overflow-hidden rounded-lg min-[375px]:rounded-xl bg-gray-800 animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => handleImageClick(item)}
            >
              {/* Card with fixed aspect ratio */}
              <div className="relative w-full aspect-[4/5] overflow-hidden rounded-lg min-[375px]:rounded-xl bg-gray-800">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    console.error('Image load error:', item.image);
                    e.currentTarget.style.display = 'none';
                  }}
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex flex-col items-center justify-center p-3 min-[375px]:p-4 opacity-0 group-hover:opacity-100">
                  <h3 className="text-white text-base min-[375px]:text-lg sm:text-xl font-bold mb-1.5 min-[375px]:mb-2 text-center px-2">
                    {item.name}
                  </h3>
                  {item.description && (
                    <p className="text-gray-300 text-xs min-[375px]:text-sm sm:text-base text-center line-clamp-2 px-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal with scroll */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-2 min-[375px]:p-3 sm:p-4 md:p-6 animate-fade-in"
          onClick={closeModal}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col bg-gray-900 rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-2 min-[375px]:top-3 sm:top-4 right-2 min-[375px]:right-3 sm:right-4 z-10 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white p-1.5 min-[375px]:p-2 rounded-full transition-colors touch-manipulation"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 min-[375px]:w-6 min-[375px]:h-6" />
            </button>

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1">
              {/* Image */}
              <div className="relative w-full bg-gray-800 flex items-center justify-center p-2 min-[375px]:p-4">
                <img
                  src={selectedImage.image}
                  alt={selectedImage.name}
                  className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                  onError={(e) => {
                    console.error('Modal image load error:', selectedImage.image);
                  }}
                />
              </div>

              {/* Content */}
              <div className="p-4 min-[375px]:p-5 sm:p-6 bg-gray-900">
                <h3 className="text-white text-lg min-[375px]:text-xl sm:text-2xl font-bold mb-2 min-[375px]:mb-3">
                  {selectedImage.name}
                </h3>
                {selectedImage.description && (
                  <p className="text-gray-400 text-sm min-[375px]:text-base sm:text-lg leading-relaxed">
                    {selectedImage.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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
          animation: fade-in 0.6s ease-out;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Custom scrollbar for modal */
        .overflow-y-auto::-webkit-scrollbar {
          width: 8px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgb(31, 41, 55);
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgb(75, 85, 99);
          border-radius: 4px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgb(107, 114, 128);
        }
      `}</style>
    </div>
  );
}

export default WorksPage;
