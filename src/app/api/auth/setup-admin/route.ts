import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'fallback-secret';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se usuário existe e é admin
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    if (user.type !== 'ADMIN') {
      return NextResponse.json(
        { 
          error: 'Usuário não é admin',
          currentType: user.type,
          message: 'Use /api/admin/setup primeiro para tornar admin'
        },
        { status: 403 }
      );
    }

    // Gerar token JWT
    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email,
        name: user.name,
        type: user.type 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      success: true,
      message: 'Token gerado com sucesso!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        type: user.type,
      }
    });

  } catch (error: any) {
    console.error('Erro:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
