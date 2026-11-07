import { MetadataRoute } from 'next';
import { getHajjPackages } from '@/lib/db-queries';
import { articles } from '@/data/blog-articles';

const BASE_URL = 'https://al-wasil.fr';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
 const routes = [
 { url: '/', priority: 1.0, changeFrequency: 'weekly' as const },
 { url: '/education', priority: 0.9, changeFrequency: 'weekly' as const },
 { url: '/convertis', priority: 0.7, changeFrequency: 'monthly' as const },
 { url: '/events', priority: 0.9, changeFrequency: 'daily' as const },
 { url: '/solidarity', priority: 0.9, changeFrequency: 'weekly' as const },
 { url: '/jobs', priority: 0.9, changeFrequency: 'daily' as const },
 { url: '/sante', priority: 0.9, changeFrequency: 'monthly' as const },
 { url: '/librairies', priority: 0.8, changeFrequency: 'monthly' as const },
 { url: '/piscines', priority: 0.8, changeFrequency: 'monthly' as const },
 { url: '/hajj', priority: 0.9, changeFrequency: 'weekly' as const },
 { url: '/lieux-priere', priority: 0.8, changeFrequency: 'weekly' as const },
 { url: '/guide', priority: 0.7, changeFrequency: 'monthly' as const },
 { url: '/blog', priority: 0.7, changeFrequency: 'weekly' as const },
 { url: '/contact', priority: 0.5, changeFrequency: 'monthly' as const },
 { url: '/legal', priority: 0.3, changeFrequency: 'yearly' as const },
 { url: '/justice', priority: 0.8, changeFrequency: 'monthly' as const },
 { url: '/annonceurs', priority: 0.6, changeFrequency: 'monthly' as const },
 ];

 const offers = await getHajjPackages();
 const blogRoutes = articles.map(article => ({ url: `/blog/${article.slug}`, priority: 0.65, changeFrequency: 'monthly' as const, lastModified: article.lastUpdated }));
 return [...routes, ...blogRoutes, ...offers.map(offer => ({ url: `/hajj/offres/${encodeURIComponent(offer.id)}`, priority: 0.75, changeFrequency: 'weekly' as const, lastModified: offer.lastVerifiedAt }))].map(route => {
 const sitemapEntry = {
  url: `${BASE_URL}${route.url}`,
  changeFrequency: route.changeFrequency,
  priority: route.priority,
 };
 return 'lastModified' in route && (typeof route.lastModified === 'string' || route.lastModified instanceof Date)
  ? { ...sitemapEntry, lastModified: route.lastModified }
  : sitemapEntry;
 });
}
