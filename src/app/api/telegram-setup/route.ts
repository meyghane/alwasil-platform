// GET /api/telegram-setup
// A appeler UNE SEULE FOIS pour enregistrer le webhook Telegram

import { NextResponse } from 'next/server';

export async function GET() {
  const token      = process.env.TELEGRAM_BOT_TOKEN || '';
  const webhookUrl = 'https://al-wasil.fr/api/telegram-webhook';

  const res  = await fetch(
    `https://api.telegram.org/bot${token}/setWebhook?url=${encodeURIComponent(webhookUrl)}&allowed_updates=["message","edited_message"]`
  );
  const data = await res.json();
  return NextResponse.json(data);
}
