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
      className="group relative w-full min-h-[270px] min-[375px]:min-h-[280px] sm:min-h-[550px] md:min-h-[500px] lg:min-h-[700px] xl:min-h-[800px] 2xl:min-h-[1150px] overflow-hidden touch-pan-y"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Slides */}
      <div className="relative w-full h-full min-h-[270px] min-[375px]:min-h-[280px] sm:min-h-[550px] md:min-h-[500px] lg:min-h-[700px] xl:min-h-[800px] 2xl:min-h-[1150px]">
        {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Background: image or gradient with NUVIA */}
              {slide.image ? (
                <Image
                  src={slide.image}
                  alt={slide.categoryName}
                  width={1920}
                  height={1150}
                  className="w-full h-full object-cover object-center absolute inset-0"
                  unoptimized
                  priority={index === 0}
                  sizes="100vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <div className="text-white text-4xl min-[375px]:text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold">NUVIA</div>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-black/60 z-10" />
              <div className="relative z-20 flex flex-col items-center justify-center text-center px-3 min-[375px]:px-4 sm:px-6 lg:px-8 xl:px-12 w-full h-full">
                <h2 
                  key={`title-${slide.id}-${currentSlide}`}
                  className="text-2xl min-[375px]:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold text-white mb-4 min-[375px]:mb-6 sm:mb-8 lg:mb-10 drop-shadow-2xl"
                >
                  {slide.categoryName}
                </h2>
                <button
                  key={`btn-${slide.id}-${currentSlide}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOrder(slide.categorySlug);
                  }}
                  className="px-5 min-[375px]:px-6 sm:px-8 lg:px-10 xl:px-12 py-2.5 min-[375px]:py-3 sm:py-4 lg:py-5 bg-white text-black font-bold text-sm min-[375px]:text-base sm:text-lg lg:text-xl rounded-lg hover:bg-gray-200 hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  {t('orderButton')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots indicator - Always visible on mobile, show on hover for desktop */}
      <div className="absolute bottom-3 min-[375px]:bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex gap-1.5 min-[375px]:gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              goToSlide(index);
            }}
            className={`w-1.5 h-1.5 min-[375px]:w-2 min-[375px]:h-2 sm:w-3 sm:h-3 rounded-full transition-all cursor-pointer touch-manipulation ${
              index === currentSlide
                ? 'bg-white w-5 min-[375px]:w-6 sm:w-8'
                : 'bg-white/50 hover:bg-white/75 active:bg-white/90'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation arrows - Always visible on mobile, hidden on larger screens until hover */}
      <button
        onClick={() => goToSlide((currentSlide - 1 + slides.length) % slides.length)}
        className="block sm:hidden absolute left-2 top-1/2 transform -translate-y-1/2 text-white/90 hover:text-white active:text-white text-3xl transition-colors z-30 bg-black/30 hover:bg-black/50 rounded-full w-10 h-10 flex items-center justify-center touch-manipulation"
        aria-label="Previous slide"
      >
        ‹
      </button>
      <button
        onClick={() => goToSlide((currentSlide + 1) % slides.length)}
        className="block sm:hidden absolute right-2 top-1/2 transform -translate-y-1/2 text-white/90 hover:text-white active:text-white text-3xl transition-colors z-30 bg-black/30 hover:bg-black/50 rounded-full w-10 h-10 flex items-center justify-center touch-manipulation"
        aria-label="Next slide"
      >
        ›
      </button>
      
      {/* Navigation arrows for desktop - Show on hover */}
      <button
        onClick={() => goToSlide((currentSlide - 1 + slides.length) % slides.length)}
        className="hidden sm:block absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white text-3xl sm:text-4xl transition-colors z-30 opacity-0 group-hover:opacity-100"
        aria-label="Previous slide"
      >
        ‹
      </button>
      <button
        onClick={() => goToSlide((currentSlide + 1) % slides.length)}
        className="hidden sm:block absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white text-3xl sm:text-4xl transition-colors z-30 opacity-0 group-hover:opacity-100"
        aria-label="Next slide"
      >
        ›
      </button>

    </div>
  );
}

