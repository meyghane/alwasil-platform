import { NextRequest, NextResponse } from 'next/server';
import { and, count, desc, eq, notLike } from 'drizzle-orm';
import { db } from '@/db';
import { items } from '@/db/schema';
import { moderationChatId, sendModerationText, sendReview } from '@/lib/telegram-moderation';

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
  if (!process.env.TELEGRAM_BOT_TOKEN || !moderationChatId()) {
    return NextResponse.json({ error: 'Telegram non configuré' }, { status: 503 });
  }
  try {
    const pending = and(eq(items.status, 'pending'), notLike(items.source, 'telegram:%'));
    const [total] = await db.select({ value: count() }).from(items).where(pending);
    if (total.value === 0) return NextResponse.json({ ok: true, pending: 0 });
    const recent = await db.select().from(items).where(pending).orderBy(desc(items.createdAt)).limit(5);
    await sendModerationText(`${total.value} fiches automatiques attendent une vérification. Voici les 5 plus récentes. Toutes les autres sont dans https://al-wasil.fr/admin/soumissions`);
    for (const item of recent) await sendReview(item);
    return NextResponse.json({ ok: true, pending: total.value, previews: recent.length });
  } catch (error) {
    console.error('[moderation-digest] failed:', error);
    return NextResponse.json({ error: 'Envoi impossible' }, { status: 503 });
  }
}
