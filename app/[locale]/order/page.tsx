import { setRequestLocale } from 'next-intl/server';
import { OrderPage } from '@/views/order';

export default function Order({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return <OrderPage />;
}

