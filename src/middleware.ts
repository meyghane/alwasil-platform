import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/admin-auth';
import { verifyUserToken } from '@/lib/user-auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protège toutes les routes /admin sauf /admin/login
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    // Vérifie l'ancien cookie aw_admin
    const adminToken = request.cookies.get('aw_admin')?.value;
    if (adminToken && await verifySessionToken(adminToken)) {
      return NextResponse.next();
    }

    // Vérifie le nouveau cookie aw_user avec rôle admin
    const userToken = request.cookies.get('aw_user')?.value;
    if (userToken) {
      const session = await verifyUserToken(userToken);
      if (session?.role === 'admin') return NextResponse.next();
    }

    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
