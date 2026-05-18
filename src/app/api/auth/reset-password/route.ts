// POST /api/auth/reset-password?step=request  → envoie email avec lien
// POST /api/auth/reset-password?step=confirm   → vérifie token et change le mdp

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend   = new Resend(process.env.RESEND_API_KEY);
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://alwasil-platform.vercel.app';
const SECRET   = process.env.ADMIN_SESSION_SECRET || 'fallback_secret';

// ── Token reset (valable 1h) ─────────────────────────────────
async function createResetToken(email: string): Promise<string> {
  const payload = btoa(JSON.stringify({ email, exp: Date.now() + 3600_000 }));
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  const sigHex = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
  return `${payload}.${sigHex}`;
}

async function verifyResetToken(token: string): Promise<string | null> {
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return null;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const expected = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  const expectedHex = Array.from(new Uint8Array(expected)).map(b => b.toString(16).padStart(2, '0')).join('');
  if (expectedHex !== sig) return null;
  try {
    const { email, exp } = JSON.parse(atob(payload));
    if (Date.now() > exp) return null;
    return email;
  } catch { return null; }
}

export async function POST(req: NextRequest) {
  const step = req.nextUrl.searchParams.get('step') || 'request';
  const body = await req.json();

  // ── Étape 1 : demande de reset ─────────────────────────────
  if (step === 'request') {
    const { email } = body;
    if (!email) return NextResponse.json({ error: 'Email requis' }, { status: 400 });

    // Vérifier que l'email existe dans les comptes (env ou Apps Script)
    let exists = false;
    const envAccounts = JSON.parse(process.env.MODO_ACCOUNTS || '[]');
    exists = envAccounts.some((a: { email: string }) => a.email === email);

    if (!exists) {
      const appsUrl = process.env.APPS_SCRIPT_WEBHOOK_URL;
      if (appsUrl) {
        try {
          const res = await fetch(`${appsUrl}?action=listUsers`);
          if (res.ok) {
            const data = await res.json();
            exists = (data.users || []).some((u: { email: string }) => u.email === email);
          }
        } catch { /* ignore */ }
      }
    }

    // Répondre toujours OK (sécurité : ne pas révéler si l'email existe)
    if (exists) {
      const token = await createResetToken(email);
      const resetUrl = `${BASE_URL}/modo/reset-password?token=${encodeURIComponent(token)}`;

      await resend.emails.send({
        from: 'Al-Wasil <onboarding@resend.dev>',
        to: email,
        subject: '[Al-Wasil] Réinitialisation de ton mot de passe',
        html: `
          <div style="font-family:sans-serif;max-width:500px;margin:0 auto">
            <div style="background:linear-gradient(135deg,#c9973a,#8a6025);padding:24px;border-radius:12px 12px 0 0;text-align:center">
              <h1 style="color:white;margin:0;font-size:1.2rem">Al-Wasil</h1>
              <p style="color:rgba(255,255,255,0.7);margin:4px 0 0;font-size:0.85rem">Réinitialisation du mot de passe</p>
            </div>
            <div style="padding:24px;border:1px solid #fdfbf0;border-top:none;border-radius:0 0 12px 12px">
              <p style="color:#374151;font-size:0.9rem;line-height:1.6">
                Bonjour,<br><br>
                Une demande de réinitialisation de mot de passe a été faite pour ton compte Al-Wasil.<br><br>
                Clique sur le bouton ci-dessous pour choisir un nouveau mot de passe. Ce lien expire dans <strong>1 heure</strong>.
              </p>
              <div style="text-align:center;margin:24px 0">
                <a href="${resetUrl}" style="background:linear-gradient(135deg,#c9973a,#8a6025);color:white;padding:12px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:0.95rem;display:inline-block">
                  Réinitialiser mon mot de passe
                </a>
              </div>
              <p style="color:#9ca3af;font-size:0.75rem;text-align:center">
                Si tu n'as pas fait cette demande, ignore cet email.<br>
                Le lien expire dans 1 heure.
              </p>
            </div>
          </div>
        `,
      }).catch(() => {});
    }

    return NextResponse.json({ ok: true, message: 'Si cet email existe, un lien a été envoyé.' });
  }

  // ── Étape 2 : confirmation du reset ───────────────────────
  if (step === 'confirm') {
    const { token, newPassword } = body;
    if (!token || !newPassword) return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
    if (newPassword.length < 6) return NextResponse.json({ error: 'Mot de passe trop court (min. 6 caractères)' }, { status: 400 });

    const email = await verifyResetToken(token);
    if (!email) return NextResponse.json({ error: 'Lien invalide ou expiré' }, { status: 400 });

    // Mettre à jour le mot de passe dans Apps Script
    const appsUrl = process.env.APPS_SCRIPT_WEBHOOK_URL;
    if (appsUrl) {
      try {
        await fetch(appsUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'updatePassword', email, newPassword }),
        });
      } catch { /* ignore */ }
    }

    // Si compte dans env var → on ne peut pas le mettre à jour dynamiquement
    // (il faut que l'admin le fasse manuellement dans .env)
    return NextResponse.json({ ok: true, message: 'Mot de passe mis à jour. Tu peux te connecter.' });
  }

  return NextResponse.json({ error: 'Étape invalide' }, { status: 400 });
}
