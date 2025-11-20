import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale: 'arm',
  localeDetection: false
});

export const config = {
  matcher: ['/', '/(ru|en|arm)/:path*']
};

