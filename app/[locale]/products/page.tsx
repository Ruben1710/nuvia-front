import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { ProductsPage } from '@/views/products';

export default function Products({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return (
    <Suspense fallback={<div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16"><div className="text-white text-center">Загрузка...</div></div>}>
      <ProductsPage />
    </Suspense>
  );
}

