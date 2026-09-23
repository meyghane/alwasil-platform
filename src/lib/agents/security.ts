import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';
import { get as httpsGet } from 'node:https';
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
  // Connect to the validated address, preserving TLS verification and SNI.
  // A second DNS lookup must not redirect an approved host to a private IP.
  return new Promise<string>((resolve,reject) => {
    const address=addresses[0]; let size=0; const chunks:Buffer[]=[];
    const request=httpsGet({hostname:address.address,family:address.family,servername:parsed.hostname,
      path:parsed.pathname+parsed.search,headers:{Host:parsed.hostname,'User-Agent':'AlWasil-DirectoryVerifier/1.0'},
    },response=>{
      if (response.statusCode!==200 || !response.headers['content-type']?.includes('text/html')) {response.resume();request.destroy(new Error('Source ou format refusé'));return;}
      response.on('data',(chunk:Buffer)=>{size+=chunk.length;if(size>1_000_000)request.destroy(new Error('Source trop volumineuse'));else chunks.push(chunk);});
      response.on('end',()=>{clearTimeout(timer);resolve(Buffer.concat(chunks).toString('utf8'));});
      response.on('error',()=>{clearTimeout(timer);reject(new Error('Source interrompue'));});
    });
    const timer=setTimeout(()=>request.destroy(new Error('Source trop lente')),8000);
    request.on('error',()=>{clearTimeout(timer);reject(new Error('Source indisponible'));});
  });
}
export function adminActionAllowed(isAdmin: boolean, action: string): boolean {
  return isAdmin && ['archive','restore','rollback','reverify','merge','source'].includes(action);
}
