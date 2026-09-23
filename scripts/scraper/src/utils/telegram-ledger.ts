import { neon } from '@neondatabase/serverless';
export async function telegramOnce(key: string, recipient: string, type: string, send: () => Promise<void>, itemId?: string): Promise<void> {
  const sql = neon(process.env.DATABASE_URL!);
  const rows=await sql`INSERT INTO telegram_deliveries(dedupe_key,item_id,source,recipient,notification_type) VALUES (${key},${itemId || null},'gemini-scraper',${recipient},${type}) ON CONFLICT DO NOTHING RETURNING dedupe_key`;
  if (!rows.length) return;
  try { await send(); await sql`UPDATE telegram_deliveries SET result='sent',completed_at=now() WHERE dedupe_key=${key}`; }
  catch { await sql`UPDATE telegram_deliveries SET result='uncertain',completed_at=now() WHERE dedupe_key=${key}`; throw new Error('Livraison Telegram à vérifier dans le journal.'); }
}
