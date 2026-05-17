// POST /api/chat-interne
// Publie un message dans le channel Pusher correspondant
// + sauvegarde dans Google Sheets pour l'historique

import { NextRequest, NextResponse } from 'next/server';
import { isAdminLoggedIn } from '@/lib/admin-auth';
import { getUserSession } from '@/lib/user-auth';
import Pusher from 'pusher';

function getPusher() {
  return new Pusher({
    appId:   process.env.PUSHER_APP_ID || '',
    key:     process.env.NEXT_PUBLIC_PUSHER_KEY || '',
    secret:  process.env.PUSHER_SECRET || '',
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'eu',
    useTLS:  true,
  });
}

export async function POST(req: NextRequest) {
  const oldAdmin = await isAdminLoggedIn();
  const session  = await getUserSession();
  if (!oldAdmin && !session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const { message, channel } = await req.json();
  if (!message?.trim()) return NextResponse.json({ error: 'Message vide' }, { status: 400 });

  const authorName = session?.name || 'Admin';
  const authorRole = session?.role || 'admin';
  const now        = new Date().toISOString();

  const msg = {
    id:        `msg-${Date.now()}`,
    text:      message.trim(),
    author:    authorName,
    role:      authorRole,
    createdAt: now,
  };

  // Canal : 'general' (tous) ou 'admin-{name}' (privé)
  const channelName = channel === 'general' ? 'modo-general' : `modo-admin`;

  try {
    const pusher = getPusher();
    await pusher.trigger(channelName, 'new-message', msg);
  } catch (e) {
    console.error('[chat] Pusher error:', e);
    return NextResponse.json({ error: 'Pusher non configuré' }, { status: 500 });
  }

  // Notification Telegram (seulement si ce n'est pas l'admin qui écrit)
  const tgToken = process.env.TELEGRAM_BOT_TOKEN;
  const tgChat  = process.env.TELEGRAM_CHAT_ID;
  if (tgToken && tgChat && authorRole !== 'admin') {
    const chanLabel = channelName === 'modo-general' ? '👥 Canal Équipe' : '🔒 Canal Admin';
    const adminUrl  = 'https://alwasil-platform.vercel.app/admin';
    const tgMsg = `💬 <b>Nouveau message — ${chanLabel}</b>\n\n👤 <b>${authorName}</b>\n💬 ${message.trim()}\n\n👉 <a href="${adminUrl}">Répondre dans l'admin</a>`;
    fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: tgChat, text: tgMsg, parse_mode: 'HTML', disable_web_page_preview: true }),
    }).catch(() => {});
  }

  // Sauvegarde dans Google Sheets pour l'historique
  const appsUrl = process.env.APPS_SCRIPT_WEBHOOK_URL;
  if (appsUrl) {
    fetch(appsUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'saveMessage',
        message: { ...msg, channel: channelName },
      }),
    }).catch(() => {});
  }

  return NextResponse.json({ ok: true, message: msg });
}

export async function GET(req: NextRequest) {
  const oldAdmin = await isAdminLoggedIn();
  const session  = await getUserSession();
  if (!oldAdmin && !session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const channel  = req.nextUrl.searchParams.get('channel') || 'general';
  const appsUrl  = process.env.APPS_SCRIPT_WEBHOOK_URL;

  if (!appsUrl) return NextResponse.json({ messages: [] });

  try {
    const res = await fetch(`${appsUrl}?action=getMessages&channel=${channel === 'general' ? 'modo-general' : 'modo-admin'}`, { cache: 'no-store' });
    if (!res.ok) return NextResponse.json({ messages: [] });
    const data = await res.json();
    return NextResponse.json({ messages: data.messages || [] });
  } catch {
    return NextResponse.json({ messages: [] });
  }
}
