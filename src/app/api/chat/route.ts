import { db } from '@/db';
import { items } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { answerChat } from '@/lib/chat-search';
import { getHajjPackages } from '@/lib/db-queries';

// Factual directory search: no visitor data or factual prose sent to a model.
export async function POST(request: Request) {
  return answerChat(request, async () => {
    const [records, packages] = await Promise.all([db.select({
    id: items.id, category: items.category, status: items.status, title: items.title,
    city: items.city, dateStart: items.dateStart, isSpam: items.isSpam, metadata: items.metadata,
    }).from(items).where(and(eq(items.status, 'approved'), eq(items.isSpam, false))), getHajjPackages()]);
    const publicIds = new Set(packages.map(offer => offer.id));
    return records.map(record => ({ ...record, metadata: { ...record.metadata, publicOfferVerified: record.category === 'hajj' && publicIds.has(record.id) } }));
  });
}
