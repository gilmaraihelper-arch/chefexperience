import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/admin/setup - Setup inicial: tornar gilmar.aihelper@gmail.com admin
export async function POST(request: NextRequest) {
  try {
    const targetEmail = 'gilmar.aihelper@gmail.com';
    
    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { email: targetEmail },
    });

    if (!user) {
      return NextResponse.json(
        { 
          error: 'Usuário não encontrado', 
          message: 'Faça login primeiro com gilmar.aihelper@gmail.com para criar o usuário'
        },
        { status: 404 }
      );
    }

    // Tornar admin
    const updatedUser = await prisma.user.update({
      where: { email: targetEmail },
      data: { type: 'ADMIN' },
    });

    return NextResponse.json({
      success: true,
      message: 'Usuário configurado como administrador!',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        type: updatedUser.type,
      },
    });
  } catch (error: any) {
    console.error('Erro ao configurar admin:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno' },
      { status: 500 }
    );
  }
}

// GET /api/admin/setup - Verificar status
export async function GET(request: NextRequest) {
  try {
    const targetEmail = 'gilmar.aihelper@gmail.com';
    
    const user = await prisma.user.findUnique({
      where: { email: targetEmail },
      select: { id: true, name: true, email: true, type: true }
    });

    if (!user) {
      return NextResponse.json({
        exists: false,
        message: 'Usuário ainda não existe. Faça login primeiro.',
      });
    }

    return NextResponse.json({
      exists: true,
      isAdmin: user.type === 'ADMIN',
      user,
      message: user.type === 'ADMIN' 
        ? 'Usuário já é administrador!' 
        : 'Usuário existe mas não é admin. Use POST para promover.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
