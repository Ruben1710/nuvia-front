'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/shared/ui/product-card';
import { useProductsStore } from '@/shared/store/productsStore';
import { useCategoriesStore } from '@/shared/store/categoriesStore';

export function ProductsPage() {
  const t = useTranslations('products');
  const locale = useLocale();
  const searchParams = useSearchParams();
  const { products, loading, error, fetchProducts } = useProductsStore();
  const { categories, fetchCategories } = useCategoriesStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [products.length, categories.length, fetchProducts, fetchCategories]);

  // Читаем категорию из URL при загрузке страницы
  useEffect(() => {
    if (searchParams) {
      const categoryFromUrl = searchParams.get('category');
      if (categoryFromUrl) {
        setSelectedCategory(categoryFromUrl);
      }
    }
  }, [searchParams]);

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
        <div className="text-white text-center">Загрузка товаров...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
        <div className="text-red-400 text-center">Ошибка: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 min-[375px]:px-4 sm:px-6 lg:px-8 xl:px-12 py-6 min-[375px]:py-8 sm:py-12 md:py-16 lg:py-20">
      {/* Header */}
      <div className="text-center mb-8 min-[375px]:mb-10 sm:mb-12 md:mb-16 lg:mb-20">
        <h1 className="text-2xl min-[375px]:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-3 min-[375px]:mb-4 lg:mb-6 animate-fade-in px-2">
          {t('title')}
        </h1>
        <p className="text-base min-[375px]:text-lg sm:text-xl lg:text-2xl text-gray-400 animate-fade-in-delay px-2 max-w-3xl mx-auto">
          {t('description')}
        </p>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="mb-6 min-[375px]:mb-8 sm:mb-12">
          <div className="flex flex-wrap gap-2 min-[375px]:gap-3 sm:gap-4 justify-center px-2">
            <button
              onClick={() => setSelectedCategory(null)}
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
                  onClick={() => setSelectedCategory(category.slug)}
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
      )}

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center text-gray-400 py-8 min-[375px]:py-10 sm:py-12 lg:py-16 px-2">
          <p className="text-sm min-[375px]:text-base lg:text-lg">{t('noProducts') || 'Нет товаров'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 min-[375px]:gap-5 sm:gap-6 md:gap-8 lg:gap-10">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
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

        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.2s both;
        }
      `}</style>
    </div>
  );
}

export default ProductsPage;

