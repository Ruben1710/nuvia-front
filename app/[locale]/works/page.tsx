import { setRequestLocale } from 'next-intl/server';
import { WorksPage } from '@/views/works/works-page';

export default function Works({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return <WorksPage />;
}

