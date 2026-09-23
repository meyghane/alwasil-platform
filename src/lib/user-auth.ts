// Gestion des sessions utilisateur (admin + modo)
const SECRET = process.env.ADMIN_SESSION_SECRET || '';
const USER_COOKIE = 'aw_user';
const MAX_AGE = 60 * 60 * 8; // 8h

export type UserRole = 'admin' | 'modo';
export type Permission = 'all' | 'piscine' | 'events' | 'mosquees' | 'emploi' | 'instituts' | 'cagnottes' | 'hajj' | 'librairies' | 'psy' | 'hijama' | 'roqya';

export interface UserSession {
 id: string;
 email: string;
 role: UserRole;
 name: string;
 permissions: Permission[];
}

export interface ModoAccount {
 id: string;
 email: string;
 password: string;
 name: string;
 role: UserRole;
 permissions: Permission[];
 actif: boolean;
 createdAt?: string;
 createdBy?: string;
}

// ── Crypto (même algo que admin-auth.ts) ────────────────────────
async function getKey(): Promise<CryptoKey> {
 if (SECRET.length < 32) throw new Error('Configuration de session absente ou insuffisante');
 return crypto.subtle.importKey('raw', new TextEncoder().encode(SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

async function sign(data: string): Promise<string> {
 const key = await getKey();
 const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
 return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifySignature(data: string, signature: string): Promise<boolean> {
 const expected = await sign(data);
 if (expected.length !== signature.length) return false;
 let diff = 0;
 for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
 return diff === 0;
}

// ── Session token ────────────────────────────────────────────────
export async function createUserToken(session: UserSession): Promise<string> {
 const payload = btoa(JSON.stringify({ ...session, ts: Date.now() }));
 const sig = await sign(payload);
 return `${payload}.${sig}`;
}

export async function verifyUserToken(token: string): Promise<UserSession | null> {
 if (SECRET.length < 32) return null;
 const [payload, sig] = token.split('.');
 if (!payload || !sig) return null;
 if (!(await verifySignature(payload, sig))) return null;
 try {
 const data = JSON.parse(atob(payload));
 if (!Number.isFinite(data.ts) || data.ts > Date.now() || Date.now() - data.ts > MAX_AGE * 1000 || !['admin','modo'].includes(data.role)) return null;
 return { id: data.id, email: data.email, role: data.role, name: data.name, permissions: data.permissions };
 } catch {
 return null;
 }
}

export async function getUserSession(): Promise<UserSession | null> {
 const { cookies } = await import('next/headers');
 const store = await cookies();
 const token = store.get(USER_COOKIE)?.value;
 if (!token) return null;
 return verifyUserToken(token);
}

export async function isUserLoggedIn(): Promise<boolean> {
 return (await getUserSession()) !== null;
}

export async function isModoOrAdmin(): Promise<boolean> {
 const session = await getUserSession();
 return session !== null && (session.role === 'admin' || session.role === 'modo');
}

export function getUserCookieName() { return USER_COOKIE; }
export function getUserMaxAge() { return MAX_AGE; }

// ── Vérification des droits ──────────────────────────────────────
export function hasPermission(session: UserSession, category: string): boolean {
 if (session.role === 'admin') return true;
 return session.permissions.includes('all') || session.permissions.includes(category as Permission);
}

// ── Charger les comptes modo depuis env MODO_ACCOUNTS ───────────
export function getModoAccountsFromEnv(): ModoAccount[] {
 try {
 const raw = process.env.MODO_ACCOUNTS;
 if (!raw) return [];
 return JSON.parse(raw) as ModoAccount[];
 } catch {
 return [];
 }
}

// ── Charger les comptes modo depuis Apps Script ──────────────────
export async function getModoAccountsFromSheet(): Promise<ModoAccount[]> {
 const url = process.env.APPS_SCRIPT_WEBHOOK_URL;
 if (!url) return [];
 try {
 const res = await fetch(`${url}?action=listUsers`, { cache: 'no-store' });
 if (!res.ok) return [];
 const data = await res.json();
 return (data.users || []) as ModoAccount[];
 } catch {
 return [];
 }
}

// ── Hash SHA-256 (pour comparer avec les mots de passe hachés) ───
async function sha256(str: string): Promise<string> {
 const data = new TextEncoder().encode(str);
 const hash = await crypto.subtle.digest('SHA-256', data);
 return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// ── Authentifier un utilisateur ──────────────────────────────────
// Comptes permanents - hash SHA-256 uniquement (le mot de passe en clair n'est pas stocké)
// Admin : al-wasil@hotmail.com / salamaleykoum
// Modo test : test@gmail.com / test
export async function authenticateUser(email: string, password: string): Promise<UserSession | null> {
 if (SECRET.length < 32 || typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password || password.length > 1024) return null;
 const hashed = await sha256(password);

 // 2. Admin depuis env vars (compatibilité ancienne config)
 if (email === process.env.ADMIN_EMAIL) {
 const adminPwd = process.env.ADMIN_PASSWORD || '';
 if (adminPwd && (password === adminPwd || hashed === adminPwd)) {
 return { id: 'admin', email, role: 'admin', name: 'Admin', permissions: ['all'] };
 }
 }

 // 2. Comptes modo depuis MODO_ACCOUNTS env var (test + fallback)
 const envAccounts = getModoAccountsFromEnv();
 const envUser = envAccounts.find(u =>
 u.email === email && (u.password === password || u.password === hashed) && u.actif
 );
 if (envUser) {
 return { id: envUser.id, email: envUser.email, role: envUser.role, name: envUser.name, permissions: envUser.permissions };
 }

 // 3. Comptes modo depuis Apps Script (Google Sheet "Comptes")
 // Envoie le hash SHA-256 - Apps Script ne voit jamais le mot de passe en clair
 const url = process.env.APPS_SCRIPT_WEBHOOK_URL;
 if (url) {
 try {
 const res = await fetch(url, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ action: 'login', email, password: hashed }),
 signal: AbortSignal.timeout(8000),
 });
 if (res.ok) {
 const data = await res.json();
 if (data.success && data.user) {
 return {
 id: data.user.id,
 email: data.user.email,
 role: data.user.role,
 name: data.user.name,
 permissions: data.user.permissions || ['all'],
 };
 }
 }
 } catch { /* Apps Script indisponible */ }
 }

 return null;
}
