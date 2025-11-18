'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useProductsStore } from '@/shared/store/productsStore';
import { useCartStore } from '@/shared/store/cartStore';
import { ProductFilters } from '@/shared/ui/product-filters';
import { ProductImageSlider } from '@/shared/ui/product-image-slider';
import { QuickOrderModal } from '@/shared/ui/quick-order-modal';

// Новая структура фильтров с бэкенда
interface MaterialFromUs {
  required: boolean;
  type: boolean;
  priceModifier: number;
  help: {
    en: string;
    ru: string;
    arm: string;
  };
}

interface SizeOption {
  size: {
    en: string;
    ru: string;
    arm: string;
  };
  priceModifier: number;
}

interface ProductFiltersData {
  materialFromUs?: MaterialFromUs;
  productSize?: SizeOption[];
  printSize?: SizeOption[];
  photoEdit?: boolean;
  model?: SizeOption[];
}

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
  images: string[];
  filters?: ProductFiltersData;
}

interface ProductDetailPageProps {
  productId: number;
}

export function ProductDetailPage({ productId }: ProductDetailPageProps) {
  const locale = useLocale();
  const t = useTranslations('products');
  const router = useRouter();
  const { add } = useCartStore();
  const { products, loading, fetchProduct, getProductById } = useProductsStore();
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [specialNotes, setSpecialNotes] = useState<string>('');
  const [selectedModelIndex, setSelectedModelIndex] = useState<number | null>(null);
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<{
    size?: string;
    printSize?: string;
    materialFromUs: boolean;
    materialFromYou: boolean;
    needsPhotoEditing: boolean;
    model?: string;
  }>({
    materialFromUs: true,
    materialFromYou: false,
    needsPhotoEditing: false,
  });

  // Загружаем продукт, если его нет в store
  useEffect(() => {
    const product = getProductById(productId);
    if (!product && !loading) {
      fetchProduct(productId);
    }
  }, [productId, loading, getProductById, fetchProduct]);

  const product = getProductById(productId);

  // Инициализируем цену только один раз (до условных возвратов!)
  useEffect(() => {
    if (product) {
      setCurrentPrice(product.price);
    }
  }, [product?.id]); // Только при смене продукта

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
        <div className="text-center">
          <div className="text-white">Загрузка товара...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">{t('notFound')}</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 px-4">{t('productNotFound')}</p>
        </div>
      </div>
    );
  }

  const productName = product.name[locale as 'en' | 'ru' | 'arm'] || product.name.en;
  const productDescription = product.description[locale as 'en' | 'ru' | 'arm'] || product.description.en;

  const handleAddToCart = () => {
    const firstImage = product.images && product.images.length > 0 ? product.images[0].url : product.image;
    add({
      id: product.id,
      name: productName,
      price: currentPrice,
      basePrice: product.price,
      image: firstImage,
      filters: selectedFilters,
    });
  };

  const handleOrder = () => {
    setIsQuickOrderOpen(true);
  };

  const handleFiltersChange = (filters: {
    size?: string;
    printSize?: string;
    materialFromUs: boolean;
    materialFromYou: boolean;
    needsPhotoEditing: boolean;
    model?: string;
  }) => {
    setSelectedFilters(filters);
    // Обновляем индекс выбранной модели для фильтрации изображений
    if (filters.model !== undefined) {
      const modelIndex = filters.model ? parseInt(filters.model) : null;
      setSelectedModelIndex(modelIndex);
    } else {
      setSelectedModelIndex(null);
    }
  };

  const handlePriceChange = (price: number) => {
    setCurrentPrice(price);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
      {/* Back Button */}
      <button
        onClick={() => router.push(`/${locale}/products`)}
        className="mb-6 flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
        {/* Product Images Slider */}
        <div>
          {product.images && product.images.length > 0 ? (
            <ProductImageSlider
              images={product.images}
              selectedModelIndex={selectedModelIndex}
            />
          ) : (
            <div className="relative w-full aspect-square bg-gradient-to-br from-gray-800 to-black rounded-lg overflow-hidden flex items-center justify-center">
              <div className="text-white text-4xl sm:text-5xl md:text-6xl font-bold opacity-20">NUVIA</div>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-4 sm:space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">{productName}</h1>
            <p className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
              {currentPrice.toFixed(0)} ֏
            </p>
          </div>

          <div className="border-t border-gray-800 pt-4 sm:pt-6">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">{t('productDescription')}</h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">{productDescription}</p>
          </div>

          {/* Product Filters */}
          {product.filters && (
            <div className="border-t border-gray-800 pt-4 sm:pt-6">
              <ProductFilters
                filters={product.filters}
                basePrice={product.price}
                onFiltersChange={handleFiltersChange}
                onPriceChange={handlePriceChange}
              />
            </div>
          )}

          <div className="border-t border-gray-800 pt-4 sm:pt-6">
            {/* Special Notes Textarea */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-semibold text-white mb-2">
                {t('specialNotes')}
              </label>
              <textarea
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-white resize-none"
                placeholder={t('specialNotesPlaceholder')}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <button 
                onClick={handleOrder}
                className="flex-1 px-6 sm:px-8 py-3 sm:py-4 bg-white text-black font-bold text-base sm:text-lg rounded-lg hover:bg-gray-200 transition-colors"
              >
                {t('orderButton')}
              </button>
              <button 
                onClick={handleAddToCart}
                className="flex-1 sm:flex-none px-6 py-3 sm:py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black transition-colors text-base sm:text-lg"
              >
                {t('addToCart')}
              </button>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-4 sm:pt-6">
            <div className="space-y-2 text-xs sm:text-sm text-gray-400">
              <p><strong className="text-white">{t('category')}:</strong> {product.category}</p>
              <p><strong className="text-white">{t('productId')}:</strong> #{product.id}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Order Modal */}
      {product && (
        <QuickOrderModal
          isOpen={isQuickOrderOpen}
          onClose={() => setIsQuickOrderOpen(false)}
          product={{
            id: product.id,
            name: productName,
            price: currentPrice,
            basePrice: product.price,
            image: product.images && product.images.length > 0 ? product.images[0].url : product.image,
            filters: selectedFilters,
          }}
        />
      )}
    </div>
  );
}

