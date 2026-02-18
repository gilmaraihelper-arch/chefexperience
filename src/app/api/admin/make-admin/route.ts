import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/admin/make-admin - Tornar usuário atual admin (apenas para setup inicial)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Verificar se já existe algum admin
    const existingAdmin = await prisma.user.findFirst({
      where: { type: 'ADMIN' },
    });

    // Se já existe admin e não é o usuário atual, negar
    if (existingAdmin && existingAdmin.id !== session.user.id) {
      return NextResponse.json(
        { error: 'Já existe um administrador. Apenas o admin atual pode promover outros.' },
        { status: 403 }
      );
    }

    // Tornar usuário atual admin
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { type: 'ADMIN' },
    });

    return NextResponse.json({
      success: true,
      message: 'Você agora é administrador!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        type: user.type,
      },
    });
  } catch (error: any) {
    console.error('Erro ao tornar admin:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno' },
      { status: 500 }
    );
  }
}
