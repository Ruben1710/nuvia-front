import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nuvia Print — Custom Gifts & Personalized Products',
  description: 'Personalized mugs, T-shirts, aluminum prints, phone cases and more. Custom gifts with high-quality printing.',
  metadataBase: new URL('https://nuviaprint.art'),
  openGraph: {
    title: 'Nuvia Print — Custom Gifts & Personalized Products',
    description: 'Personalized mugs, T-shirts, aluminum prints, phone cases and more. Custom gifts with high-quality printing.',
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
    description: 'Personalized mugs, T-shirts, aluminum prints, phone cases and more. Custom gifts with high-quality printing.',
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
