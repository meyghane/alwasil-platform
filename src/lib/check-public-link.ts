import { lookup } from 'node:dns/promises';
import https from 'node:https';
import http from 'node:http';
import { normalizeUrl } from './data-quality';

export async function checkPublicLink(value: string): Promise<string> {
  let current = normalizeUrl(value);
  if (!current) return 'invalid_url';
  try {
    const deadline = Date.now() + 8000;
    for (let hop = 0; hop < 4; hop++) {
      const url = new URL(current);
      if (Date.now() >= deadline) return 'unavailable';
      if (url.port && !['80', '443'].includes(url.port)) return 'blocked_address';
      const addresses = await lookup(url.hostname, { all: true });
      // Only public IPv4, pinned in request lookup to prevent DNS rebinding.
      const address = addresses.find(a => a.family === 4)?.address;
      if (!address) return 'unavailable';
      const [a,b] = address.split('.').map(Number);
      if (a === 0 || a === 10 || a === 127 || a >= 224 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127) || (a === 198 && [18,19].includes(b))) return 'blocked_address';
      const response = await new Promise<{ status: number; location?: string }>((resolve, reject) => {
        const request = (url.protocol === 'https:' ? https : http).request(url, {
          method: 'HEAD', headers: { 'User-Agent': 'AlWasil-LinkCheck/1.0' },
          lookup: (_host, _options, callback) => callback(null, [{ address, family: 4 }]),
        }, res => { res.resume(); resolve({ status: res.statusCode ?? 0, location: res.headers.location }); });
        request.setTimeout(5000, () => request.destroy(new Error('timeout')));
        const timeout = setTimeout(() => request.destroy(new Error('deadline')), Math.max(1, deadline - Date.now()));
        request.on('close', () => clearTimeout(timeout));
        request.on('error', reject); request.end();
      });
      if (response.status >= 300 && response.status < 400 && response.location) { current = normalizeUrl(new URL(response.location, current).toString()); if (!current) return 'invalid_url'; continue; }
      if ([404,410].includes(response.status)) return 'broken';
      if (response.status >= 200 && response.status < 300) return 'reachable';
      return 'unavailable'; // 403/429/405/5xx do not establish that a link is broken.
    }
    return 'redirect_limit';
  } catch { return 'unavailable'; }
}
