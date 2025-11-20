import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nuvia Print — Custom Gifts & Personalized Products | Sublimation Printing Vanadzor',
  description: 'Personalized mugs, T-shirts, aluminum prints, phone cases and more. Custom gifts with high-quality sublimation printing. Тպագրություն, սուբլիմացիա, print vanadzor, tpargum.',
  metadataBase: new URL('https://nuviaprint.art'),
  keywords: [
    // Armenian
    'տպագրություն',
    'սուբլիմացիա',
    'սուբլիմացիոն տպագրություն',
    'պատվերով տպագրություն',
    'բաժակների տպագրություն',
    'շորերի տպագրություն',
    'պատյանների տպագրություն',
    'ֆոտո տպագրություն',
    'ալյումինի վրա տպագրություն',
    'անհատական նվերներ',
    'տպագրություն Վանաձոր',
    'պատվերով նվերներ',
    'ստուդիա տպագրություն',
    'արագ տպագրություն',
    'tpargum',
    'sublimation armenia',
    // Russian
    'сублимация',
    'сублимационная печать',
    'печать на кружках',
    'печать на футболках',
    'печать на алюминии',
    'печать на чехлах',
    'печать фото',
    'печать по сублимации',
    'индивидуальная печать',
    'персональные подарки',
    'печать в Ванадзоре',
    'подарки на заказ',
    'custom print russia',
    'sublimation print',
    // English
    'sublimation',
    'sublimation printing',
    'custom sublimation gifts',
    'mug sublimation',
    't-shirt sublimation',
    'aluminum sublimation printing',
    'photo sublimation',
    'custom printing',
    'personalized gifts',
    'print studio',
    'vanadzor printing',
    'high quality sublimation',
  ],
  openGraph: {
    title: 'Nuvia Print — Custom Gifts & Personalized Products',
    description: 'Personalized mugs, T-shirts, aluminum prints, phone cases and more. Custom gifts with high-quality sublimation printing.',
    url: 'https://nuviaprint.art',
    siteName: 'Nuvia Print',
    images: [
      {
        url: 'https://nuviaprint.art/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Nuvia Print Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nuvia Print — Custom Gifts & Personalized Products',
    description: 'Personalized mugs, T-shirts, aluminum prints, phone cases and more. Custom gifts with high-quality sublimation printing.',
    images: ['https://nuviaprint.art/opengraph-image.png'],
  },
  icons: {
    icon: [
      { url: '/icon.ico', sizes: 'any' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://nuviaprint.art',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
