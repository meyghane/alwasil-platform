import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';
export function publicAddress(address: string): boolean {
  if (address.includes(':')) return !/^(::|fc|fd|fe8|fe9|fea|feb|ff)/i.test(address) && !address.includes('.');
  const parts = address.split('.').map(Number);
  return parts.length === 4 && ![0,10,127,169,192,224,240,255].includes(parts[0]) && !(parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) && !(parts[0] === 100 && parts[1] >= 64 && parts[1] <= 127);
}
export async function fetchOfficialPage(url: string): Promise<string> {
  const parsed = new URL(url);
  if (parsed.protocol !== 'https:' || parsed.username || parsed.password || parsed.port || isIP(parsed.hostname) || !parsed.hostname.includes('.')) throw new Error('URL non autorisée');
  const addresses = await lookup(parsed.hostname, { all: true });
  if (!addresses.length || addresses.some(result => !publicAddress(result.address))) throw new Error('Destination privée refusée');
  const response = await fetch(parsed, { redirect: 'error', signal: AbortSignal.timeout(8000), headers: { 'User-Agent': 'AlWasil-DirectoryVerifier/1.0' } });
  if (!response.ok) throw new Error(`Source HTTP ${response.status}`);
  if (!response.headers.get('content-type')?.includes('text/html')) throw new Error('Format source non pris en charge');
  const reader = response.body?.getReader();
  if (!reader) throw new Error('Source vide');
  const chunks: Uint8Array[] = []; let size = 0;
  try {
    while (true) { const part = await reader.read(); if (part.done) break; size += part.value.length; if (size > 1_000_000) throw new Error('Source trop volumineuse'); chunks.push(part.value); }
  } finally { await reader.cancel().catch(() => {}); }
  return Buffer.concat(chunks).toString('utf8');
}
export function adminActionAllowed(isAdmin: boolean, action: string): boolean {
  return isAdmin && ['archive','restore','rollback','reverify','merge','source'].includes(action);
}
