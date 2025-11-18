import { setRequestLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';

export default function Gallery({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  redirect('/works');
}

