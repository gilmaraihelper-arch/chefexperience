import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';

const ADMIN_EMAILS = ['gilmar.aihelper@gmail.com'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Só verificar para rotas de admin
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    try {
      // Pega o token JWT
      const token = await getToken({ 
        req: request,
        secret: process.env.NEXTAUTH_SECRET 
      });

      // Se não tem token, redireciona para login
      if (!token?.email) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      // Verifica se é admin por email (whitelist)
      if (ADMIN_EMAILS.includes(token.email)) {
        // Verifica no banco se realmente é admin
        const user = await prisma.user.findUnique({
          where: { email: token.email },
          select: { type: true }
        });

        // Se não é admin no banco, atualiza
        if (user && user.type !== 'ADMIN') {
          await prisma.user.update({
            where: { email: token.email },
            data: { type: 'ADMIN' }
          });
        }

        // Permite acesso
        return NextResponse.next();
      }

      // Verifica no banco se é admin
      const user = await prisma.user.findUnique({
        where: { email: token.email as string },
        select: { type: true }
      });

      if (user?.type !== 'ADMIN') {
        // Redireciona para dashboard normal
        return NextResponse.redirect(new URL('/dashboard/cliente', request.url));
      }

      return NextResponse.next();
    } catch (error) {
      console.error('Erro no middleware:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*']
}
