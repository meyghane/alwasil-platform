import { NextResponse } from 'next/server';
import { db } from '@/db';
import { audienceEvents } from '@/db/schema';

export async function POST(request: Request) {
  try {
    const body = await request.json() as { eventType?: unknown; path?: unknown; slot?: unknown; referrer?: unknown; consent?: unknown };
    const path = typeof body.path === 'string' ? body.path.slice(0, 240) : '';
    if (!path || body.consent !== true) return NextResponse.json({ ok: true });
    await db.insert(audienceEvents).values({
      eventType: typeof body.eventType === 'string' ? body.eventType.slice(0, 50) : 'page_view',
      path,
      slot: typeof body.slot === 'string' ? body.slot.slice(0, 100) : undefined,
      referrer: typeof body.referrer === 'string' ? body.referrer.slice(0, 500) : undefined,
      consent: true,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[audience] event failed:', error instanceof Error ? error.message : 'unknown error');
    return NextResponse.json({ ok: true });
  }
}
