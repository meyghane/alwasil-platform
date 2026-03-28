import { MetadataRoute } from 'next';

const BASE_URL = 'https://alwasil-platform.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { url: '/', priority: 1.0, changeFrequency: 'weekly' as const },
    { url: '/education', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/events', priority: 0.9, changeFrequency: 'daily' as const },
    { url: '/solidarity', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/jobs', priority: 0.9, changeFrequency: 'daily' as const },
    { url: '/sante', priority: 0.9, changeFrequency: 'monthly' as const },
    { url: '/librairies', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/piscines', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/hajj', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/justice', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/annonceurs', priority: 0.6, changeFrequency: 'monthly' as const },
  ];

  return routes.map(route => ({
    url: `${BASE_URL}${route.url}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
