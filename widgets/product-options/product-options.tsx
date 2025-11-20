'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';
import { useCartStore } from '@/shared/store/cartStore';
import { ProductFilters } from '@/shared/ui/product-filters';
import { QuickOrderModal } from '@/shared/ui/quick-order-modal';

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
  filters?: ProductFiltersData;
}

interface ProductOptionsProps {
  product: Product;
  currentPrice: number;
  onPriceChange: (price: number) => void;
  onModelChange: (modelIndex: number | null) => void;
}

export function ProductOptions({
  product,
  currentPrice,
  onPriceChange,
  onModelChange,
}: ProductOptionsProps) {
  const locale = useLocale();
  const t = useTranslations('products');
  const { add } = useCartStore();
  const [specialNotes, setSpecialNotes] = useState<string>('');
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

  const productName = product.name[locale as 'en' | 'ru' | 'arm'] || product.name.en;

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
      onModelChange(modelIndex);
    } else {
      onModelChange(null);
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Options/Filters */}
        {product.filters && (
          <div>
            <ProductFilters
              filters={product.filters}
              basePrice={product.price}
              onFiltersChange={handleFiltersChange}
              onPriceChange={onPriceChange}
            />
          </div>
        )}

        {/* Special Notes */}
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            {t('specialNotes')}
          </label>
          <textarea
            value={specialNotes}
            onChange={(e) => setSpecialNotes(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 text-sm bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-white resize-none"
            placeholder={t('specialNotesPlaceholder')}
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-12">
          <button
            onClick={handleOrder}
            className="flex-1 px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-colors"
          >
            {t('orderButton')}
          </button>
          <button
            onClick={handleAddToCart}
            className="flex-1 sm:flex-none px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black active:bg-gray-100 transition-colors"
          >
            {t('addToCart')}
          </button>
        </div>
      </div>

      {/* Quick Order Modal */}
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
    </>
  );
}

