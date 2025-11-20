'use client';

import { ProductCard } from '@/shared/ui/product-card';

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

interface ProductsGridProps {
  products: Product[];
  emptyMessage?: string;
}

export function ProductsGrid({ products, emptyMessage }: ProductsGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8 min-[375px]:py-10 sm:py-12 lg:py-16 px-2">
        <p className="text-sm min-[375px]:text-base lg:text-lg">{emptyMessage || 'Нет товаров'}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="w-full md:max-w-[350px] animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

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
      `}</style>
    </>
  );
}

