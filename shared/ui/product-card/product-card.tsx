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
    <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-gray-800 h-full flex flex-col">
      <div className="relative w-full h-48 min-[375px]:h-56 sm:h-64 md:h-72 lg:h-80 xl:h-96 bg-gradient-to-br from-gray-800 to-black aspect-square">
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <div className="text-white text-2xl min-[375px]:text-3xl sm:text-4xl lg:text-5xl font-bold">NUVIA</div>
        </div>
        {product.image && (
          <Image
            src={product.image}
            alt={productName}
            fill
            className="object-cover"
            sizes="(max-width: 375px) 100vw, (max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
            unoptimized
            onError={(e) => {
              console.error('Image load error:', product.image);
              e.currentTarget.style.display = 'none';
            }}
          />
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

