import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, fields } = body;

    const TO_EMAIL = process.env.CONTACT_EMAIL || 'meyghvne@gmail.com';
    const now = new Date().toLocaleString('fr-FR');

    // ── 1. Email via Resend ─────────────────────────────────────
    const subject = `[Al-Wasil] Nouvelle soumission : ${type}`;
    const html = `
      <h2>Nouvelle soumission via Al-Wasil — ${type}</h2>
      <table style="border-collapse:collapse;width:100%">
        ${Object.entries(fields as Record<string, string>)
          .map(([k, v]) => `
            <tr>
              <td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600;background:#f9fafb;width:180px">${k}</td>
              <td style="padding:8px 12px;border:1px solid #e5e7eb">${v || '—'}</td>
            </tr>`)
          .join('')}
      </table>
      <p style="margin-top:24px">
        <a href="https://alwasil-platform.vercel.app/admin/soumissions" style="background:#7c3aed;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:700">
          👉 Valider dans l'admin
        </a>
      </p>
      <p style="margin-top:16px;color:#6b7280;font-size:13px">Envoyé depuis al-wasil.fr — ${now}</p>
    `;

    resend.emails.send({
      from: 'Al-Wasil <onboarding@resend.dev>',
      to: [TO_EMAIL],
      subject,
      html,
      replyTo: (fields as Record<string, string>)?.email || undefined,
    }).catch(e => console.error('[contact] Resend error:', e));

    // ── 2. Make webhook → Gemini → Google Sheet ─────────────────
    const makeUrl = process.env.MAKE_WEBHOOK_URL;
    if (makeUrl) {
      const row = {
        id: `${type}-${Date.now()}`,
        categorie: type,
        status: 'à vérifier',
        soumis_le: new Date().toISOString(),
        soumis_par: 'public',
        ...fields,
      };
      fetch(makeUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(row),
      }).catch(e => console.error('[contact] Make webhook error:', e));
    }

    // ── 3. Telegram notification ────────────────────────────────
    const tgToken = process.env.TELEGRAM_BOT_TOKEN;
    const tgChatId = process.env.TELEGRAM_CHAT_ID;
    if (tgToken && tgChatId) {
      const nom = (fields as Record<string, string>)?.name ||
                  (fields as Record<string, string>)?.nom ||
                  (fields as Record<string, string>)?.titre || '';
      const ville = (fields as Record<string, string>)?.ville || '';
      const text = `🔔 <b>Nouvelle soumission publique</b>\n\n📁 <b>${type}</b>${nom ? `\n📝 ${nom}` : ''}${ville ? `\n📍 ${ville}` : ''}\n\n👉 <a href="https://alwasil-platform.vercel.app/admin/soumissions">Valider maintenant</a>`;

      fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: tgChatId, text, parse_mode: 'HTML' }),
      }).catch(e => console.error('[contact] Telegram error:', e));
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
