'use client';

import { useState, useEffect, useMemo } from 'react';

interface ProductImage {
  url: string;
  modelIds: number[];
}

interface ProductSliderProps {
  images: ProductImage[];
  selectedModelIndex?: number | null;
}

export function ProductSlider({
  images,
  selectedModelIndex,
}: ProductSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Фильтруем изображения по выбранной модели
  const filteredImages = useMemo(() => {
    if (selectedModelIndex === null || selectedModelIndex === undefined) {
      return images;
    }
    return images.filter((img) => img.modelIds.includes(selectedModelIndex));
  }, [images, selectedModelIndex]);

  const currentImage = filteredImages[currentIndex];

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
      <div className="w-full aspect-1 bg-gray-900 rounded-xl overflow-hidden flex items-center justify-center">
        <p className="text-gray-400">Нет изображений</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 my-4">
      {/* Main Image */}
      <div className="w-full aspect-1 overflow-hidden rounded-xl bg-gray-900">
        <img
          src={currentImage.url}
          alt={`Product image ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnails */}
      {filteredImages.length > 1 && (
        <div className="flex gap-3 mt-4 overflow-x-auto lg:overflow-visible scrollbar-hide">
          {filteredImages.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all ${
                index === currentIndex
                  ? 'ring-2 ring-white rounded-lg'
                  : 'opacity-60 hover:opacity-80'
              }`}
            >
              <img
                src={image.url}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

