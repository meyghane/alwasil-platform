import { createHash } from 'node:crypto';
import { NextResponse } from 'next/server';
import { isAdminLoggedIn } from '@/lib/admin-auth';

// Installation volontaire seulement, jamais déclenchée par une simple visite GET.
export async function POST() {
  if (!(await isAdminLoggedIn())) return NextResponse.json({ error: 'Admin requis' }, { status: 403 });
  const token = process.env.TELEGRAM_BOT_TOKEN || '';
  if (!token || !process.env.TELEGRAM_CHAT_ID || !process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: 'Configuration Telegram incomplète' }, { status: 503 });
  }
  const secret = createHash('sha256').update(token).digest('hex');
  const response = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: 'https://al-wasil.fr/api/telegram-webhook', secret_token: secret, allowed_updates: ['message', 'edited_message'] }),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) return NextResponse.json({ error: 'Configuration Telegram échouée' }, { status: 502 });
  const result = await response.json() as { ok?: boolean };
  return NextResponse.json({ ok: result.ok === true }, { status: result.ok ? 200 : 502 });
}

export async function GET() {
  return NextResponse.json({ error: 'Utiliser POST avec une session administrateur' }, { status: 405 });
}
