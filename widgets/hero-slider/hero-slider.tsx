'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { useCategoriesStore } from '@/shared/store/categoriesStore';

interface Slide {
  id: number;
  image: string | null;
  categoryName: string;
  categorySlug: string;
}

export function HeroSlider() {
  const t = useTranslations('slider');
  const router = useRouter();
  const locale = useLocale();
  const { categories, fetchCategories } = useCategoriesStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Минимальное расстояние для свайпа (в пикселях)
  const minSwipeDistance = 50;

  // Загружаем категории при монтировании
  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [categories.length, fetchCategories]);

  // Создаем слайды из всех категорий
  const slides = useMemo(() => {
    return categories.map((category) => {
      const categoryName = locale === 'en' 
        ? category.nameEn 
        : locale === 'ru' 
        ? category.nameRu 
        : category.nameArm;
      const categoryImage = category.img || null;
      
      return {
        id: category.id,
        image: categoryImage,
        categoryName,
        categorySlug: category.slug,
      };
    });
  }, [categories, locale]);

  useEffect(() => {
    if (isPaused || slides.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length, isPaused]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsPaused(true);
    // Возобновляем автопрокрутку через задержку
    setTimeout(() => {
      setIsPaused(false);
    }, 3000);
  };

  const handleOrder = (categorySlug: string) => {
    if (categorySlug) {
      router.push(`/${locale}/products?category=${categorySlug}`);
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsPaused(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setIsPaused(false);
      return;
    }
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      // Свайп влево - следующий слайд
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    } else if (isRightSwipe) {
      // Свайп вправо - предыдущий слайд
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }
    
    // Возобновляем автопрокрутку через небольшую задержку
    setTimeout(() => {
      setIsPaused(false);
    }, 3000);
  };

  return (
    <div 
      className="group relative w-full h-[600px] sm:h-[700px] md:h-[800px] overflow-hidden touch-pan-y"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
            <div className="relative w-full h-full">
              {/* Background: image or gradient with NUVIA */}
              {slide.image ? (
                <div className="relative w-full h-full overflow-hidden">
                  <Image
                    src={slide.image}
                    unoptimized
                    alt={slide.categoryName}
                    fill
                    className="object-cover"
                    style={{ 
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center'
                    }}
                    priority={index === 0}
                  />
                </div>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <div className="text-white text-9xl font-bold">NUVIA</div>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-black/60" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6">
                <h2 
                  key={`title-${slide.id}-${currentSlide}`}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 sm:mb-8"
                >
                  {slide.categoryName}
                </h2>
                <button
                  key={`btn-${slide.id}-${currentSlide}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOrder(slide.categorySlug);
                  }}
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-black font-bold text-base sm:text-lg rounded-lg hover:bg-gray-200 hover:shadow-lg hover:scale-105 transition-all duration-300 relative z-10"
                >
                  {t('orderButton')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots indicator - Show on hover */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              goToSlide(index);
            }}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all cursor-pointer ${
              index === currentSlide
                ? 'bg-white w-6 sm:w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation arrows - Hidden on mobile */}
      <button
        onClick={() => goToSlide((currentSlide - 1 + slides.length) % slides.length)}
        className="hidden sm:block absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white text-3xl sm:text-4xl transition-colors z-10"
        aria-label="Previous slide"
      >
        ‹
      </button>
      <button
        onClick={() => goToSlide((currentSlide + 1) % slides.length)}
        className="hidden sm:block absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white text-3xl sm:text-4xl transition-colors z-10"
        aria-label="Next slide"
      >
        ›
      </button>

    </div>
  );
}

