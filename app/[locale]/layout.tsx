import { ReactNode } from 'react';
import { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Inter } from 'next/font/google';
import { locales } from '@/i18n';
import { CartProvider } from '@/shared/lib/cart-context';
import { AppWrapper } from '@/widgets/app-wrapper';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

// Inherit metadata from parent layout - ensure OG tags work for all locales
export const metadata: Metadata = {};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <CartProvider>
        <div className={`${inter.className}`}>
          <AppWrapper>{children}</AppWrapper>
        </div>
      </CartProvider>
    </NextIntlClientProvider>
  );
}

