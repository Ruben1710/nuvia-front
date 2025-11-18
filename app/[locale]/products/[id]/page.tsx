import { ProductDetailPage } from '@/pages/product-detail';

interface ProductPageProps {
  params: {
    id: string;
    locale: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const productId = parseInt(params.id, 10);

  return <ProductDetailPage productId={productId} />;
}

