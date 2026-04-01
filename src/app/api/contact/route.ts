import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, fields } = body;

    const TO_EMAIL = process.env.CONTACT_EMAIL || 'meyghvne@gmail.com';

    const subject = `[Al-Wasil] Nouvelle demande : ${type}`;
    const html = `
      <h2>Nouvelle demande via Al-Wasil — ${type}</h2>
      <table style="border-collapse:collapse;width:100%">
        ${Object.entries(fields as Record<string, string>)
          .map(([k, v]) => `
            <tr>
              <td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600;background:#f9fafb;width:180px">${k}</td>
              <td style="padding:8px 12px;border:1px solid #e5e7eb">${v || '—'}</td>
            </tr>`)
          .join('')}
      </table>
      <p style="margin-top:24px;color:#6b7280;font-size:13px">
        Envoyé depuis al-wasil.fr — ${new Date().toLocaleString('fr-FR')}
      </p>
    `;

    const { error } = await resend.emails.send({
      from: 'Al-Wasil <onboarding@resend.dev>',
      to: [TO_EMAIL],
      subject,
      html,
      replyTo: fields?.email || undefined,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
