import { setRequestLocale } from 'next-intl/server';
import { DeliveryPage } from '@/pages/delivery';

export default function Delivery({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return <DeliveryPage />;
}

