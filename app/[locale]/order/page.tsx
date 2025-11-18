import { setRequestLocale } from 'next-intl/server';
import { OrderPage } from '@/pages/order';

export default function Order({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return <OrderPage />;
}

