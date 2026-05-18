// POST /api/admin/inviter
// Génère un lien d'invitation sécurisé (valable 7 jours) et envoie par email
// Le modo clique, choisit son mot de passe → compte créé automatiquement

import { NextRequest, NextResponse } from 'next/server';
import { isAdminLoggedIn } from '@/lib/admin-auth';
import { getUserSession } from '@/lib/user-auth';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const SECRET = process.env.ADMIN_SESSION_SECRET || 'fallback';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://alwasil-platform.vercel.app';

async function assertAdmin() {
 if (await isAdminLoggedIn()) return true;
 const s = await getUserSession();
 return !!(s && s.role === 'admin');
}

async function createInviteToken(data: object): Promise<string> {
 const payload = btoa(JSON.stringify({ ...data, exp: Date.now() + 7 * 24 * 3600_000 }));
 const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
 const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
 const sigHex = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
 return `${payload}.${sigHex}`;
}

export async function POST(req: NextRequest) {
 if (!(await assertAdmin())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

 const { email, name, role, permissions } = await req.json();
 if (!email) return NextResponse.json({ error: 'Email requis' }, { status: 400 });

 const token = await createInviteToken({ email, name, role: role || 'modo', permissions: permissions || ['all'] });
 const inviteUrl = `${BASE_URL}/modo/invitation?token=${encodeURIComponent(token)}`;

 // Envoyer l'email d'invitation
 await resend.emails.send({
 from: 'Al-Wasil <onboarding@resend.dev>',
 to: email,
 subject: `[Al-Wasil] Tu as été invité(e) à rejoindre l'équipe de modération`,
 html: `
 <div style="font-family:sans-serif;max-width:520px;margin:0 auto">
 <div style="background:linear-gradient(135deg,#3b0764,#1e0545);padding:28px;border-radius:14px 14px 0 0;text-align:center">
 <div style="color:white;font-size:1.5rem;font-weight:900;letter-spacing:-0.02em">Al-Wasil</div>
 <div style="color:rgba(196,181,253,0.7);font-size:0.85rem;margin-top:4px">الواصل</div>
 </div>
 <div style="padding:28px;border:1px solid #fdfbf0;border-top:none;border-radius:0 0 14px 14px;background:white">
 <h2 style="color:#0f0225;font-size:1.1rem;margin:0 0 12px">Bienvenue dans l'équipe !</h2>
 <p style="color:#374151;font-size:0.9rem;line-height:1.7;margin:0 0 20px">
 ${name ? `<strong>${name}</strong>, tu` : 'Tu'} as été invité(e) à rejoindre l'équipe de modération d'<strong>Al-Wasil</strong>.<br>
 Rôle : <strong style="color:#c9973a">${role === 'admin' ? 'Administrateur' : 'Modérateur'}</strong>
 </p>
 <div style="text-align:center;margin:24px 0">
 <a href="${inviteUrl}" style="display:inline-block;background:linear-gradient(135deg,#c9973a,#8a6025);color:white;padding:14px 36px;border-radius:12px;text-decoration:none;font-weight:700;font-size:0.95rem">
 Rejoindre l'équipe →
 </a>
 </div>
 <div style="background:#fdfbf0;border-radius:10px;padding:14px;margin-top:8px">
 <p style="margin:0;font-size:0.78rem;color:#6b7280;line-height:1.6">
 Tu vas choisir ton mot de passe à la première connexion.<br>
 Ce lien expire dans <strong>7 jours</strong>.
 </p>
 </div>
 </div>
 </div>
 `,
 }).catch(e => console.error('[invite] email error:', e));

 return NextResponse.json({ ok: true, inviteUrl });
}

// GET : vérifier/décoder un token d'invitation
export async function GET(req: NextRequest) {
 const token = req.nextUrl.searchParams.get('token');
 if (!token) return NextResponse.json({ error: 'Token manquant' }, { status: 400 });

 try {
 const [payload, sig] = token.split('.');
 const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
 const expected = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
 const expectedHex = Array.from(new Uint8Array(expected)).map(b => b.toString(16).padStart(2, '0')).join('');
 if (expectedHex !== sig) return NextResponse.json({ error: 'Token invalide' }, { status: 400 });

 const data = JSON.parse(atob(payload));
 if (Date.now() > data.exp) return NextResponse.json({ error: 'Invitation expirée' }, { status: 400 });

 return NextResponse.json({ ok: true, email: data.email, name: data.name, role: data.role, permissions: data.permissions });
 } catch {
 return NextResponse.json({ error: 'Token invalide' }, { status: 400 });
 }
}
