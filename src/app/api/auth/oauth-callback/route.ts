import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      // No session, go to login
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Check if user has a profile
    const { prisma } = await import('@/lib/prisma');
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });
    
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Check client profile
    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId: user.id }
    });
    
    if (clientProfile) {
      return NextResponse.redirect(new URL('/dashboard/cliente', request.url));
    }

    // Check professional profile
    const professionalProfile = await prisma.professionalProfile.findUnique({
      where: { userId: user.id }
    });
    
    if (professionalProfile) {
      return NextResponse.redirect(new URL('/dashboard/profissional', request.url));
    }

    // No profile yet, go to complete registration
    return NextResponse.redirect(new URL('/completar-cadastro', request.url));

  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(new URL('/login?error=callback_error', request.url));
  }
}
