// Web Crypto API — compatible Edge Runtime (middleware) + Node.js
const SECRET = process.env.ADMIN_SESSION_SECRET || 'fallback_secret';
const COOKIE_NAME = 'aw_admin';
const MAX_AGE = 60 * 60 * 8; // 8 heures

async function getKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

async function sign(data: string): Promise<string> {
  const key = await getKey(SECRET);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verify(data: string, signature: string): Promise<boolean> {
  const expected = await sign(data);
  if (expected.length !== signature.length) return false;
  // Comparaison en temps constant
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  return diff === 0;
}

export async function createSessionToken(): Promise<string> {
  const payload = btoa(JSON.stringify({ ts: Date.now() }));
  const sig = await sign(payload);
  return `${payload}.${sig}`;
}

export async function verifySessionToken(token: string): Promise<boolean> {
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return false;
  if (!(await verify(payload, sig))) return false;
  try {
    const { ts } = JSON.parse(atob(payload));
    return Date.now() - ts < MAX_AGE * 1000;
  } catch {
    return false;
  }
}

export async function isAdminLoggedIn(): Promise<boolean> {
  const { cookies } = await import('next/headers');
  const store = await cookies();

  // Ancien cookie aw_admin (backward compat)
  const adminToken = store.get(COOKIE_NAME)?.value;
  if (adminToken && await verifySessionToken(adminToken)) return true;

  // Nouveau cookie aw_user unifié (role=admin)
  const { verifyUserToken } = await import('./user-auth');
  const userToken = store.get('aw_user')?.value;
  if (userToken) {
    const session = await verifyUserToken(userToken);
    if (session?.role === 'admin') return true;
  }

  return false;
}

export function getSessionCookieName() { return COOKIE_NAME; }
export function getSessionMaxAge() { return MAX_AGE; }

// Token de validation pour les soumissions (24h)
export async function createValidationToken(data: object): Promise<string> {
  const payload = btoa(JSON.stringify({ data, exp: Date.now() + 24 * 60 * 60 * 1000 }))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  const sig = await sign(payload);
  return `${payload}.${sig}`;
}

export async function verifyValidationToken(token: string): Promise<{ data: Record<string, unknown> } | null> {
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return null;
  if (!(await verify(payload, sig))) return null;
  try {
    const padded = payload.replace(/-/g, '+').replace(/_/g, '/');
    const parsed = JSON.parse(atob(padded));
    if (Date.now() > parsed.exp) return null;
    return { data: parsed.data };
  } catch {
    return null;
  }
}
