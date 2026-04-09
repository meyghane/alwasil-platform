import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/admin-auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protège toutes les routes /admin sauf /admin/login
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = request.cookies.get('aw_admin')?.value;
    if (!token || !verifySessionToken(token)) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
