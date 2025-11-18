'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { useWorksStore } from '@/shared/store/worksStore';
import { useCategoriesStore } from '@/shared/store/categoriesStore';
import { X, ExternalLink } from 'lucide-react';

export function WorksPage() {
  const t = useTranslations('works');
  const locale = useLocale();
  const { works, loading, fetchWorks } = useWorksStore();
  const { categories, fetchCategories } = useCategoriesStore();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<{
    image: string;
    name: string;
    description: string;
    workId: number;
  } | null>(null);

  useEffect(() => {
    if (works.length === 0) {
      fetchWorks();
    }
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [works.length, categories.length, fetchWorks, fetchCategories]);

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
    ? allImages.filter((img) => {
        const category = categories.find((cat) => cat.id === selectedCategory);
        return category && img.categorySlug === category.slug;
      })
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
        <div className="text-white text-center">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
      {/* Header */}
      <div className="text-center mb-12 sm:mb-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in">
          {t('title')}
        </h1>
      </div>

      {/* Category Filter */}
      <div className="mb-8 sm:mb-12">
        <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-300 ${
              selectedCategory === null
                ? 'bg-white text-black hover:bg-gray-200'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            {t('all')}
          </button>
          {categories.map((category) => {
            const categoryName = locale === 'en' ? category.nameEn : locale === 'ru' ? category.nameRu : category.nameArm;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-white text-black hover:bg-gray-200'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                {categoryName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Masonry Grid */}
      {filteredImages.length === 0 ? (
        <div className="text-center text-gray-400 py-12">
          <p>{t('noImages')}</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 sm:gap-6">
          {filteredImages.map((item, index) => (
            <div
              key={`${item.workId}-${index}`}
              className="mb-4 sm:mb-6 break-inside-avoid group cursor-pointer relative overflow-hidden rounded-xl"
              onClick={() => handleImageClick(item)}
            >
              <div className="relative w-full overflow-hidden rounded-xl bg-gray-800">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={400}
                  height={600}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                  unoptimized
                  onError={(e) => {
                    console.error('Image load error:', item.image);
                    e.currentTarget.style.display = 'none';
                  }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex flex-col items-center justify-center p-4 opacity-0 group-hover:opacity-100">
                  <h3 className="text-white text-lg sm:text-xl font-bold mb-2 text-center">
                    {item.name}
                  </h3>
                  {item.description && (
                    <p className="text-gray-300 text-sm sm:text-base mb-4 text-center line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  <button className="px-4 sm:px-6 py-2 sm:py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                    {t('details')}
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={closeModal}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden">
              <Image
                src={selectedImage.image}
                alt={selectedImage.name}
                width={1200}
                height={1200}
                className="w-full h-auto max-h-[80vh] object-contain"
                unoptimized
                onError={(e) => {
                  console.error('Modal image load error:', selectedImage.image);
                }}
              />
              <div className="p-4 sm:p-6 bg-gray-900">
                <h3 className="text-white text-xl sm:text-2xl font-bold mb-2">
                  {selectedImage.name}
                </h3>
                {selectedImage.description && (
                  <p className="text-gray-400 text-sm sm:text-base">
                    {selectedImage.description}
                  </p>
                )}
                <a
                  href={`/products`}
                  className="inline-flex items-center gap-2 mt-4 text-white hover:text-gray-300 transition-colors"
                >
                  {t('viewProduct')}
                  <ExternalLink className="w-4 h-4" />
                </a>
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
      `}</style>
    </div>
  );
}

export default WorksPage;

