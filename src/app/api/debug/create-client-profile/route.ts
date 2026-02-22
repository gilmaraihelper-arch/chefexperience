import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'chefexperience-secret-key';

function getUserFromToken(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;
  try {
    const decoded = jwt.decode(token) as { userId?: string; id?: string; type: string };
    return {
      userId: decoded.userId || decoded.id,
      type: decoded.type
    };
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Atualizar tipo do usuário para CLIENT
    await prisma.user.update({
      where: { id: user.userId },
      data: { type: 'CLIENT' }
    });

    // Criar perfil de cliente
    const clientProfile = await prisma.clientProfile.upsert({
      where: { userId: user.userId },
      update: {},
      create: {
        userId: user.userId,
        totalEvents: 0,
        totalSpent: 0,
        rating: 0
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Perfil de cliente criado!',
      profile: clientProfile
    });

  } catch (error: any) {
    console.error('Erro:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
