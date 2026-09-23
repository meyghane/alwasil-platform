import { neon } from '@neondatabase/serverless';
import type { DeliveryStore } from './delivery-ledger';

export function telegramStore(sql = neon(process.env.DATABASE_URL!)): DeliveryStore {
  return {
    async claim(d) {
      const rows = await sql`INSERT INTO telegram_deliveries (dedupe_key,item_id,update_id,source,recipient,notification_type)
        VALUES (${d.key},${d.itemId || null},${d.updateId ?? null},${d.source},${d.recipient},${d.type})
        ON CONFLICT (dedupe_key) DO NOTHING RETURNING dedupe_key`;
      return rows.length === 1;
    },
    async finish(key, result) {
      await sql`UPDATE telegram_deliveries SET result=${result}, error_code=${result === 'uncertain' ? 'delivery_unconfirmed' : null}, completed_at=now() WHERE dedupe_key=${key}`;
    },
  };
}

export async function unsentReviewIds(recipient: string): Promise<string[]> {
  const sql = neon(process.env.DATABASE_URL!);
  const rows = await sql`SELECT i.id FROM items i WHERE i.status='pending' AND NOT EXISTS (
    SELECT 1 FROM telegram_deliveries d WHERE d.item_id=i.id AND d.recipient=${recipient} AND d.notification_type='review'
  ) ORDER BY i.created_at DESC LIMIT 100`;
  return rows.map(row => String(row.id));
}
