import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { authOptions } from '@/lib/auth';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'chefexperience-secret-key';

export async function GET(request: NextRequest) {
  try {
    // Usar getToken para acessar o JWT diretamente (mais confiável que getServerSession aqui)
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token?.email) {
      console.error('OAuth callback: No token or email found');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const { prisma } = await import('@/lib/prisma');
    
    // Buscar usuário direto do banco para garantir dados atualizados
    const user = await prisma.user.findUnique({
      where: { email: token.email as string }
    });
    
    if (!user) {
      console.error('OAuth callback: User not found for email:', token.email);
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    console.log('OAuth callback: User found:', user.id, 'Type:', user.type);

    // Gerar token JWT para APIs
    const apiToken = jwt.sign(
      { userId: user.id, email: user.email, type: user.type },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Verificar tipo do usuário PRIMEIRO, depois os perfis
    if (user.type === 'CLIENT') {
      // Garantir que tem perfil de cliente
      let clientProfile = await prisma.clientProfile.findUnique({
        where: { userId: user.id }
      });
      if (!clientProfile) {
        clientProfile = await prisma.clientProfile.create({
          data: { userId: user.id }
        });
      }
      return NextResponse.redirect(new URL(`/dashboard/cliente?token=${apiToken}`, request.url));
    }

    if (user.type === 'PROFESSIONAL') {
      // Garantir que tem perfil de profissional
      let professionalProfile = await prisma.professionalProfile.findUnique({
        where: { userId: user.id }
      });
      if (!professionalProfile) {
        professionalProfile = await prisma.professionalProfile.create({
          data: { 
            userId: user.id,
            description: '',
            eventTypes: '["corporativo"]',
            cuisineStyles: '["brasileira"]',
            serviceTypes: '["buffet"]',
            priceRanges: '[200,500]',
            capacity: '50',
          }
        });
      }
      return NextResponse.redirect(new URL(`/dashboard/profissional?token=${apiToken}`, request.url));
    }

    // Se não tem tipo, ir para completar cadastro
    return NextResponse.redirect(new URL(`/completar-cadastro/escolher-tipo?token=${apiToken}`, request.url));

  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(new URL('/login?error=callback_error', request.url));
  }
}
