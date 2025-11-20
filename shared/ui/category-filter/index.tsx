'use client';

import { useEffect, useState, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Category } from '@/shared/api/categories';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelect: (slug: string | null) => void;
}

export function CategoryFilter({ categories, selectedCategory, onSelect }: CategoryFilterProps) {
  const t = useTranslations('products');
  const locale = useLocale();
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Закрываем dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
    };

    if (isCategoryDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCategoryDropdownOpen]);

  // Получаем название выбранной категории или "Все"
  const selectedCategoryName = selectedCategory
    ? categories.find(cat => cat.slug === selectedCategory)?.[locale === 'en' ? 'nameEn' : locale === 'ru' ? 'nameRu' : 'nameArm']
    : t('all') || 'Все';

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 min-[375px]:mb-8 sm:mb-10">
      {/* Mobile Dropdown */}
      <div className="sm:hidden relative" ref={dropdownRef}>
        <button
          onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
          className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg font-semibold text-sm flex items-center justify-between border border-gray-700 hover:bg-gray-700 transition-colors"
        >
          <span>{selectedCategoryName}</span>
          <svg
            className={`w-5 h-5 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isCategoryDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden max-h-[60vh] overflow-y-auto">
            <button
              onClick={() => {
                onSelect(null);
                setIsCategoryDropdownOpen(false);
              }}
              className={`w-full px-4 py-3 text-left font-semibold text-sm transition-colors ${
                selectedCategory === null
                  ? 'bg-white text-black'
                  : 'text-white hover:bg-gray-700'
              }`}
            >
              {t('all') || 'Все'}
            </button>
            {categories.map((category) => {
              const categoryName = locale === 'en' ? category.nameEn : locale === 'ru' ? category.nameRu : category.nameArm;
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    onSelect(category.slug);
                    setIsCategoryDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left font-semibold text-sm transition-colors ${
                    selectedCategory === category.slug
                      ? 'bg-white text-black'
                      : 'text-white hover:bg-gray-700'
                  }`}
                >
                  {categoryName}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Desktop Buttons */}
      <div className="hidden sm:flex flex-wrap gap-2 min-[375px]:gap-3 sm:gap-4 justify-center px-2">
        <button
          onClick={() => onSelect(null)}
          className={`px-3 min-[375px]:px-4 sm:px-6 py-1.5 min-[375px]:py-2 sm:py-3 rounded-lg font-semibold text-xs min-[375px]:text-sm sm:text-base transition-all duration-300 ${
            selectedCategory === null
              ? 'bg-white text-black hover:bg-gray-200 active:bg-gray-300'
              : 'bg-gray-800 text-white hover:bg-gray-700 active:bg-gray-600'
          }`}
        >
          {t('all') || 'Все'}
        </button>
        {categories.map((category) => {
          const categoryName = locale === 'en' ? category.nameEn : locale === 'ru' ? category.nameRu : category.nameArm;
          return (
            <button
              key={category.id}
              onClick={() => onSelect(category.slug)}
              className={`px-3 min-[375px]:px-4 sm:px-6 py-1.5 min-[375px]:py-2 sm:py-3 rounded-lg font-semibold text-xs min-[375px]:text-sm sm:text-base transition-all duration-300 ${
                selectedCategory === category.slug
                  ? 'bg-white text-black hover:bg-gray-200 active:bg-gray-300'
                  : 'bg-gray-800 text-white hover:bg-gray-700 active:bg-gray-600'
              }`}
            >
              {categoryName}
            </button>
          );
        })}
      </div>
    </div>
  );
}

