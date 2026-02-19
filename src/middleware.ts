import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Emails permitidos como admin (hardcoded para evitar importar Prisma)
const ADMIN_EMAILS = ['gilmar.aihelper@gmail.com'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Só verificar para rotas de admin
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    // Verifica cookie de sessão
    const sessionCookie = request.cookies.get('next-auth.session-token') || 
                         request.cookies.get('__Secure-next-auth.session-token');
    
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Se for API de setup, permite
    if (pathname === '/api/admin/setup') {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
}
