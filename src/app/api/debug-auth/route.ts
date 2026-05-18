import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const data = new TextEncoder().encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const hex  = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  const expected = '6aa5c51674b639060fd6e1e055d8dbe58d53c0e80f7f950fb4d0b2eebdc205ac';
  return NextResponse.json({ hash: hex, match: hex === expected });
}
