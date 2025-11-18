import { setRequestLocale } from 'next-intl/server';
import { HomePage } from '@/pages/home';

export default function Home({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return <HomePage />;
}

