import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';
import { checkServerIdentity } from 'node:tls';
import { get as httpsGet } from 'node:https';

const MAX_REDIRECTS = 3;
const MAX_BYTES = 1_000_000;
const TOTAL_TIMEOUT_MS = 20_000;
const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);

function ipv4IsPublic(address: string): boolean {
  const parts = address.split('.');
  if (parts.length !== 4 || parts.some(part => !/^\d{1,3}$/.test(part) || Number(part) > 255)) return false;
  const [a, b, c] = parts.map(Number);
  if (a === 0 || a === 10 || a === 127 || a >= 224) return false;
  if (a === 100 && b >= 64 && b <= 127) return false;
  if (a === 169 && b === 254) return false;
  if (a === 172 && b >= 16 && b <= 31) return false;
  if (a === 192 && (b === 0 || b === 168)) return false;
  if (a === 192 && b === 88 && c === 99) return false;
  if (a === 198 && (b === 18 || b === 19 || b === 51)) return false;
  if (a === 203 && b === 0 && c === 113) return false;
  return true;
}

function ipv6IsPublic(address: string): boolean {
  // Restrict connections to global unicast (2000::/3), excluding documentation.
  // IPv4-mapped, link-local, unique-local, multicast and unspecified addresses
  // are outside this prefix and are therefore rejected.
  const normalized = address.toLowerCase().split('%')[0];
  if (normalized.includes('.')) return false;
  const halves = normalized.split('::');
  if (halves.length > 2) return false;
  const left = halves[0] ? halves[0].split(':') : [];
  const right = halves.length === 2 && halves[1] ? halves[1].split(':') : [];
  const missing = 8 - left.length - right.length;
  if ((halves.length === 1 && missing !== 0) || (halves.length === 2 && missing < 1)) return false;
  const words = [...left, ...Array(missing).fill('0'), ...right];
  if (words.length !== 8 || words.some(word => !/^[\da-f]{1,4}$/.test(word))) return false;
  const first = parseInt(words[0], 16);
  const globalUnicast = first >= 0x2000 && first <= 0x3fff; // 2000::/3
  const documentation = first === 0x2001 && parseInt(words[1], 16) === 0x0db8;
  return globalUnicast && !documentation;
}

export function publicAddress(address: string): boolean {
  const family = isIP(address);
  if (family === 4) return ipv4IsPublic(address);
  if (family === 6) return ipv6IsPublic(address);
  return false;
}

function validateUrl(value: string): URL {
  let parsed: URL;
  try { parsed = new URL(value); } catch { throw new Error('URL non autorisée'); }
  const hostname = parsed.hostname.toLowerCase().replace(/\.$/, '');
  if (parsed.protocol !== 'https:' || parsed.username || parsed.password || (parsed.port && parsed.port !== '443') ||
      isIP(hostname) || !hostname.includes('.') || hostname.length > 253 ||
      hostname.split('.').some(label => !label || label.length > 63 || label.startsWith('-') || label.endsWith('-')) ||
      /\.(?:localhost|local|internal|test|invalid|example)$/i.test(hostname)) {
    throw new Error('URL non autorisée');
  }
  parsed.hostname = hostname;
  parsed.port = '';
  parsed.hash = '';
  return parsed;
}

async function resolvePublicAddress(hostname: string) {
  let addresses: Array<{ address: string; family: number }>;
  try { addresses = await lookup(hostname, { all: true, verbatim: true }); }
  catch { throw new Error('DNS source indisponible'); }
  if (!addresses.length || addresses.some(result => !publicAddress(result.address))) {
    throw new Error('Destination privée refusée');
  }
  // Pin a validated result for the socket; the request must not resolve DNS again.
  return addresses[0];
}

async function requestOneHop(url: URL, deadline: number): Promise<{ status: number; location?: string; body?: string }> {
  const destination = await resolvePublicAddress(url.hostname);
  const remaining = deadline - Date.now();
  if (remaining <= 0) throw new Error('Source trop lente');

  return new Promise((resolve, reject) => {
    let settled = false;
    const finishError = (error: Error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(error);
    };
    const request = httpsGet({
      hostname: destination.address,
      family: destination.family,
      servername: url.hostname,
      port: 443,
      path: `${url.pathname}${url.search}`,
      method: 'GET',
      headers: { Host: url.host, 'User-Agent': 'AlWasil-DirectoryVerifier/1.0', Accept: 'text/html' },
      // The socket is pinned to the DNS answer checked above while TLS still
      // verifies the certificate against the original hostname.
      checkServerIdentity: (_hostname, certificate) => checkServerIdentity(url.hostname, certificate),
    }, response => {
      const status = response.statusCode || 0;
      if (REDIRECT_STATUSES.has(status)) {
        const location = response.headers.location;
        response.resume();
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve({ status, location });
        return;
      }
      if (status !== 200 || !response.headers['content-type']?.toLowerCase().includes('text/html')) {
        response.resume();
        finishError(new Error('Source ou format refusé'));
        return;
      }
      let size = 0;
      const chunks: Buffer[] = [];
      response.on('data', (chunk: Buffer) => {
        size += chunk.length;
        if (size > MAX_BYTES) {
          response.destroy();
          request.destroy(new Error('Source trop volumineuse'));
          return;
        }
        chunks.push(chunk);
      });
      response.on('end', () => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve({ status, body: Buffer.concat(chunks).toString('utf8') });
      });
      response.on('error', () => finishError(new Error('Source interrompue')));
    });
    const timer = setTimeout(() => request.destroy(new Error('Source trop lente')), remaining);
    request.on('error', () => finishError(new Error('Source indisponible')));
  });
}

export async function fetchOfficialPage(url: string): Promise<string> {
  const deadline = Date.now() + TOTAL_TIMEOUT_MS;
  let current = validateUrl(url);
  for (let redirects = 0; ; redirects += 1) {
    const result = await requestOneHop(current, deadline);
    if (result.body !== undefined) return result.body;
    if (!REDIRECT_STATUSES.has(result.status) || !result.location || redirects >= MAX_REDIRECTS) {
      throw new Error('Redirection refusée ou limite atteinte');
    }
    // Every redirect is independently parsed, scheme-checked, DNS-checked and pinned.
    current = validateUrl(new URL(result.location, current).toString());
  }
}

export function adminActionAllowed(isAdmin: boolean, action: string): boolean {
  return isAdmin && ['archive', 'restore', 'rollback', 'reverify', 'merge', 'source'].includes(action);
}
