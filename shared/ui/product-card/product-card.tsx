'use client';

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
    <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl border border-gray-800 w-full max-w-full flex flex-col hover:-translate-y-1 transition-all duration-300 cursor-pointer">
      <div className="w-full aspect-[4/5] rounded-xl overflow-hidden bg-gray-900">
        {product.image ? (
          <img
            src={product.image}
            alt={productName}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error('Image load error:', product.image);
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black" />
        )}
      </div>
      <div className="p-3 min-[375px]:p-4 sm:p-6 lg:p-8 flex-1 flex flex-col">
        <h3 className="text-base min-[375px]:text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1.5 min-[375px]:mb-2 lg:mb-3 line-clamp-2">
          {productName}
        </h3>
        <p className="text-gray-400 text-xs min-[375px]:text-sm lg:text-base mb-3 min-[375px]:mb-4 lg:mb-6 flex-1 line-clamp-2 sm:line-clamp-3">
          {productDescription}
        </p>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 min-[375px]:gap-3 sm:gap-0 mt-auto">
          <span className="text-lg min-[375px]:text-xl sm:text-2xl lg:text-3xl font-bold text-white">
            {product.price.toFixed(0)} ֏
          </span>
          <Link
            href={`/${locale}/products/${product.id}`}
            className="w-full sm:w-auto text-center px-3 min-[375px]:px-4 sm:px-6 lg:px-8 py-1.5 min-[375px]:py-2 lg:py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors text-xs min-[375px]:text-sm sm:text-base lg:text-lg"
          >
            {t('orderButton')}
          </Link>
        </div>
      </div>
    </div>
  );
}
