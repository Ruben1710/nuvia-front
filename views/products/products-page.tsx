'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useProductsStore } from '@/shared/store/productsStore';
import { useCategoriesStore } from '@/shared/store/categoriesStore';
import { CategoryFilter } from '@/shared/ui/category-filter';
import { ProductsGrid } from '@/shared/ui/products-grid';

export function ProductsPage() {
  const t = useTranslations('products');
  const searchParams = useSearchParams();
  const { products, loading, error, fetchProducts } = useProductsStore();
  const { categories, fetchCategories } = useCategoriesStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

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
      <div className="container mx-auto px-3 min-[375px]:px-4 sm:px-6 lg:px-8 xl:px-12 pt-16 min-[375px]:pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-8 sm:pb-16">
        <div className="text-white text-center">Загрузка товаров...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-3 min-[375px]:px-4 sm:px-6 lg:px-8 xl:px-12 pt-16 min-[375px]:pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-8 sm:pb-16">
        <div className="text-red-400 text-center">Ошибка: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 min-[375px]:px-4 sm:px-6 lg:px-8 xl:px-12 pt-16 min-[375px]:pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-6 min-[375px]:pb-8 sm:pb-12 md:pb-16 lg:pb-20">
      {/* Header */}
      <div className="text-center mb-6 min-[375px]:mb-8 sm:mb-10">
        <h1 className="text-2xl min-[375px]:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white animate-fade-in px-2">
          {t('title')}
        </h1>
      </div>

      {/* Category Filter */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* Products Grid */}
      <ProductsGrid
        products={filteredProducts}
        emptyMessage={t('noProducts') || 'Нет товаров'}
      />
    </div>
  );
}

export default ProductsPage;
