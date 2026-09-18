import { MetadataRoute } from 'next';
import { getHajjPackages } from '@/lib/db-queries';

const BASE_URL = 'https://al-wasil.fr';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
 { url: '/guide', priority: 0.7, changeFrequency: 'monthly' as const },
 { url: '/blog', priority: 0.7, changeFrequency: 'weekly' as const },
 { url: '/contact', priority: 0.5, changeFrequency: 'monthly' as const },
 { url: '/legal', priority: 0.3, changeFrequency: 'yearly' as const },
 { url: '/justice', priority: 0.8, changeFrequency: 'monthly' as const },
 { url: '/annonceurs', priority: 0.6, changeFrequency: 'monthly' as const },
 ];

 const offers = await getHajjPackages();
 return [...routes, ...offers.map(offer => ({ url: `/hajj/offres/${encodeURIComponent(offer.id)}`, priority: 0.75, changeFrequency: 'weekly' as const, lastModified: offer.lastVerifiedAt }))].map(route => ({
 url: `${BASE_URL}${route.url}`,
 lastModified: 'lastModified' in route && (typeof route.lastModified === 'string' || route.lastModified instanceof Date) ? route.lastModified : new Date(),
 changeFrequency: route.changeFrequency,
 priority: route.priority,
 }));
}
