import type { Metadata } from 'next';
import './globals.css';

// Custom favicon added
// Place your favicon.ico file in app/icon.ico
// Next.js App Router will automatically process it
export const metadata: Metadata = {
  title: 'Nuvia',
  description: 'Nuvia website',
  icons: {
    icon: [
      { url: '/icon.ico', sizes: 'any' },
      { url: '/favicon.ico', sizes: 'any' }, // Fallback to public folder
    ],
    shortcut: '/icon.ico',
    apple: '/icon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}

