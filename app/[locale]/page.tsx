import { setRequestLocale } from 'next-intl/server';
import { HomePage } from '@/views/home';

export default function Home({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return <HomePage />;
}

