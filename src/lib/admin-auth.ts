import { createHmac } from 'crypto';
import { cookies } from 'next/headers';

const SECRET = process.env.ADMIN_SESSION_SECRET || 'fallback_secret';
const COOKIE_NAME = 'aw_admin';
const MAX_AGE = 60 * 60 * 8; // 8 heures

function sign(data: string): string {
  return createHmac('sha256', SECRET).update(data).digest('hex');
}

export function createSessionToken(): string {
  const payload = JSON.stringify({ ts: Date.now() });
  const b64 = Buffer.from(payload).toString('base64');
  const sig = sign(b64);
  return `${b64}.${sig}`;
}

export function verifySessionToken(token: string): boolean {
  const [b64, sig] = token.split('.');
  if (!b64 || !sig) return false;
  if (sign(b64) !== sig) return false;
  try {
    const { ts } = JSON.parse(Buffer.from(b64, 'base64').toString());
    return Date.now() - ts < MAX_AGE * 1000;
  } catch {
    return false;
  }
}

export async function isAdminLoggedIn(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifySessionToken(token);
}

export function getSessionCookieName() { return COOKIE_NAME; }
export function getSessionMaxAge() { return MAX_AGE; }

// Token de validation pour les soumissions
export function createValidationToken(data: object): string {
  const payload = JSON.stringify({ data, ts: Date.now(), exp: Date.now() + 24 * 60 * 60 * 1000 });
  const b64 = Buffer.from(payload).toString('base64url');
  const sig = sign(b64);
  return `${b64}.${sig}`;
}

export function verifyValidationToken(token: string): { data: Record<string, unknown> } | null {
  const [b64, sig] = token.split('.');
  if (!b64 || !sig) return null;
  if (sign(b64) !== sig) return null;
  try {
    const parsed = JSON.parse(Buffer.from(b64, 'base64url').toString());
    if (Date.now() > parsed.exp) return null;
    return { data: parsed.data };
  } catch {
    return null;
  }
}
