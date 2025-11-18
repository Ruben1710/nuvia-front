'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductImage {
  url: string;
  modelIds: number[];
}

interface ProductImageSliderProps {
  images: ProductImage[];
  selectedModelIndex?: number | null;
}

export function ProductImageSlider({
  images,
  selectedModelIndex,
}: ProductImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Фильтруем изображения по выбранной модели
  const filteredImages = useMemo(() => {
    if (selectedModelIndex === null || selectedModelIndex === undefined) {
      return images;
    }
    return images.filter((img) => img.modelIds.includes(selectedModelIndex));
  }, [images, selectedModelIndex]);

  const currentImage = filteredImages[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? filteredImages.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) =>
      prev === filteredImages.length - 1 ? 0 : prev + 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  // Сбрасываем индекс при изменении фильтра
  useEffect(() => {
    if (filteredImages.length > 0 && currentIndex >= filteredImages.length) {
      setCurrentIndex(0);
    }
  }, [filteredImages.length, currentIndex]);

  if (!currentImage || filteredImages.length === 0) {
    return (
      <div className="w-full aspect-square bg-gray-800 rounded-lg flex items-center justify-center">
        <p className="text-gray-400">Нет изображений</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Основное большое изображение */}
      <div className="relative w-full aspect-square bg-gray-800 rounded-lg overflow-hidden group">
        <Image
          src={currentImage.url}
          alt={`Product image ${currentIndex + 1}`}
          fill
          unoptimized
          className="object-cover"
          priority
        />

        {/* Кнопки навигации */}
        {filteredImages.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Индикатор текущего изображения */}
        {filteredImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {filteredImages.length}
          </div>
        )}
      </div>

      {/* Миниатюры внизу */}
      {filteredImages.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
          {filteredImages.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? 'border-white scale-105'
                  : 'border-transparent hover:border-gray-500'
              }`}
            >
              <Image
                src={image.url}
                alt={`Thumbnail ${index + 1}`}
                fill
                unoptimized
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

