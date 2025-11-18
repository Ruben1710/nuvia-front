import { setRequestLocale } from 'next-intl/server';
import { DeliveryPage } from '@/views/delivery';

export default function Delivery({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return <DeliveryPage />;
}

