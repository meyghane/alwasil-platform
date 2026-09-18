import { db } from '../src/db/index.ts';
import { items } from '../src/db/schema.ts';
import { eq, desc } from 'drizzle-orm';
import { sendReview } from '../src/lib/telegram-moderation.ts';

const rows = await db.select().from(items)
  .where(eq(items.category, 'hajj'))
  .orderBy(desc(items.createdAt));
const pending = rows.filter(item => item.status === 'pending').slice(0, 20);
for (const item of pending) await sendReview(item);
console.log(JSON.stringify({ sent: pending.length, category: 'hajj' }));
