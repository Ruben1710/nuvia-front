import { setRequestLocale } from 'next-intl/server';
import { ProductDetailPage } from '@/views/product-detail';

interface ProductPageProps {
  params: {
    id: string;
    locale: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  setRequestLocale(params.locale);
  const productId = parseInt(params.id, 10);

  return <ProductDetailPage productId={productId} />;
}

