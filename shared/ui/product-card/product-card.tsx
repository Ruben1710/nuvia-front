'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';

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

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const locale = useLocale();
  const t = useTranslations('products');

  const productName = product.name[locale as 'en' | 'ru' | 'arm'] || product.name.en;
  const productDescription = product.description[locale as 'en' | 'ru' | 'arm'] || product.description.en;

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-gray-800">
      <div className="relative w-full h-64 bg-gradient-to-br from-gray-800 to-black">
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <div className="text-white text-4xl font-bold">NUVIA</div>
        </div>
        {product.image && (
          <Image
            src={product.image}
            alt={productName}
            fill
            className="object-cover"
            unoptimized
            onError={(e) => {
              console.error('Image load error:', product.image);
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
      </div>
      <div className="p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-2 line-clamp-2">
          {productName}
        </h3>
        <p className="text-gray-400 text-xs sm:text-sm mb-4 line-clamp-3">
          {productDescription}
        </p>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <span className="text-xl sm:text-2xl font-bold text-white">
            {product.price.toFixed(0)} ֏
          </span>
          <Link
            href={`/${locale}/products/${product.id}`}
            className="w-full sm:w-auto text-center px-4 sm:px-6 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base"
          >
            {t('orderButton')}
          </Link>
        </div>
      </div>
    </div>
  );
}

