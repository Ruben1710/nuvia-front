import { MetadataRoute } from 'next';
import { locales } from '@/i18n';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://nuviaprint.art';

  // Основные страницы для каждого языка
  const routes = [
    '',
    '/contacts',
    '/delivery',
    '/gallery',
    '/order',
    '/products',
    '/works',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Генерируем URL для каждой локали и страницы
  locales.forEach((locale) => {
    routes.forEach((route) => {
      const url = route === '' ? `${baseUrl}/${locale}` : `${baseUrl}/${locale}${route}`;
      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8,
      });
    });
  });

  return sitemapEntries;
}

