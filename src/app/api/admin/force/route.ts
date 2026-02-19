import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/force - Força usuário a ser admin e retorna status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email') || 'gilmar.aihelper@gmail.com';
    
    // Atualiza para admin
    const user = await prisma.user.update({
      where: { email },
      data: { type: 'ADMIN' },
    });

    return NextResponse.json({
      success: true,
      message: 'Usuário forçado como ADMIN',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        type: user.type,
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
