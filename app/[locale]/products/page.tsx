import { setRequestLocale } from 'next-intl/server';
import { ProductsPage } from '@/pages/products';

export default function Products({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return <ProductsPage />;
}

