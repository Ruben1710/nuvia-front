'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useProductsStore } from '@/shared/store/productsStore';
import { ProductSlider } from '@/shared/ui/product-slider/product-slider';
import { ProductOptions } from '@/widgets/product-options/product-options';

interface Product {
  id: number;
  category: string;
  name: {
    en: string;
    ru: string;
    arm: string;
  };
  description: {
    en: string;
    ru: string;
    arm: string;
  };
  price: number;
  image: string;
  images: Array<{ url: string; modelIds: number[] }>;
}

interface ProductDetailPageProps {
  productId: number;
}

export function ProductDetailPage({ productId }: ProductDetailPageProps) {
  const locale = useLocale();
  const t = useTranslations('products');
  const router = useRouter();
  const { loading, fetchProduct, getProductById } = useProductsStore();
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [selectedModelIndex, setSelectedModelIndex] = useState<number | null>(null);

  // Загружаем продукт, если его нет в store
  useEffect(() => {
    const product = getProductById(productId);
    if (!product && !loading) {
      fetchProduct(productId);
    }
  }, [productId, loading, getProductById, fetchProduct]);

  const product = getProductById(productId);

  // Инициализируем цену только один раз
  useEffect(() => {
    if (product) {
      setCurrentPrice(product.price);
    }
  }, [product]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-16">
        <div className="text-center">
          <div className="text-white">Загрузка товара...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-16">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">{t('notFound')}</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-400">{t('productNotFound')}</p>
        </div>
      </div>
    );
  }

  const productName = product.name[locale as 'en' | 'ru' | 'arm'] || product.name.en;
  const productDescription = product.description[locale as 'en' | 'ru' | 'arm'] || product.description.en;

  const handlePriceChange = (price: number) => {
    setCurrentPrice(price);
  };

  return (
    <div className="container mx-auto px-4 min-[375px]:px-4 sm:px-6 lg:px-8 xl:px-12 
    pt-16 min-[375px]:pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-10">
      {/* Back Button */}
      <button
        onClick={() => router.push(`/${locale}/products`)}
        className="mb-6 flex items-center gap-2 text-white hover:text-gray-300 active:text-gray-400 transition-colors"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M15 19l-7-7 7-7" />
        </svg>
        <span>{t('backToProducts')}</span>
      </button>

      {/* Main Layout: Side-by-side on desktop, stacked on mobile */}
      <div className="flex w-full flex-col lg:flex-row lg:items-start lg:gap-12">
        {/* Left Side: Product Slider */}
        <div className="w-full lg:w-[50%] lg:max-w-[550px] lg:flex-shrink-0">
          {product.images && product.images.length > 0 ? (
            <ProductSlider
              images={product.images}
              selectedModelIndex={selectedModelIndex}
            />
          ) : (
            <div className="w-full aspect-[4/5] bg-gray-900 rounded-xl overflow-hidden flex items-center justify-center">
              <p className="text-gray-400">Нет изображений</p>
            </div>
          )}
        </div>

        {/* Right Side: Product Info */}
        <div className="w-full lg:flex-1 lg:max-w-[650px]">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            {productName}
          </h1>

          {/* Price */}
          <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6">
            {currentPrice.toFixed(0)} ֏
          </p>

          {/* Description */}
          <div className="mb-10">
            <h2 className="text-lg md:text-xl font-semibold text-white mb-3">
              {t('productDescription')}
            </h2>
            <p className="text-gray-400 leading-relaxed">
              {productDescription}
            </p>
          </div>

          {/* Options */}
          <ProductOptions
            product={product}
            currentPrice={currentPrice}
            onPriceChange={handlePriceChange}
            onModelChange={setSelectedModelIndex}
          />
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
