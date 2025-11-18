import { setRequestLocale } from 'next-intl/server';
import { ContactsPage } from '@/views/contacts';

export default function Contacts({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return <ContactsPage />;
}

