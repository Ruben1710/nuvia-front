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
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
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
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
      {/* Header */}
      <div className="text-center mb-12 sm:mb-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in">
          {t('title')}
        </h1>
        <p className="text-lg sm:text-xl text-gray-400 animate-fade-in-delay">
          {t('description')}
        </p>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
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
              {t('all') || 'Все'}
            </button>
            {categories.map((category) => {
              const categoryName = locale === 'en' ? category.nameEn : locale === 'ru' ? category.nameRu : category.nameArm;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-300 ${
                    selectedCategory === category.slug
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
      )}

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center text-gray-400 py-12">
          <p>{t('noProducts') || 'Нет товаров'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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

