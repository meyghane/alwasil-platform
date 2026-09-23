import { NextRequest, NextResponse } from 'next/server';

// Email scanners may follow GET links. A GET never changes moderation state.
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id') || '';
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: 'Lien invalide' }, { status: 400 });
  return NextResponse.redirect(new URL('/admin/soumissions?item=' + encodeURIComponent(id), request.url));
}
