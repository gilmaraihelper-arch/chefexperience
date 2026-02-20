import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'chefexperience-secret-key';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const { prisma } = await import('@/lib/prisma');
    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });
    
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Gerar token JWT para APIs
    const token = jwt.sign(
      { userId: user.id, email: user.email, type: user.type },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId: user.id }
    });
    
    if (clientProfile) {
      return NextResponse.redirect(new URL(`/dashboard/cliente?token=${token}`, request.url));
    }

    const professionalProfile = await prisma.professionalProfile.findUnique({
      where: { userId: user.id }
    });
    
    if (professionalProfile) {
      return NextResponse.redirect(new URL(`/dashboard/profissional?token=${token}`, request.url));
    }

    return NextResponse.redirect(new URL(`/completar-cadastro?token=${token}`, request.url));

  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(new URL('/login?error=callback_error', request.url));
  }
}
