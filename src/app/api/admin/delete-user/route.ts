import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// ATENÇÃO: Este endpoint é apenas para desenvolvimento/teste
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Deletar contas relacionadas (OAuth)
    await (prisma as any).account.deleteMany({
      where: { userId: user.id },
    });

    // Deletar sessões
    await (prisma as any).nextauthSession.deleteMany({
      where: { userId: user.id },
    });

    // Deletar usuário
    await prisma.user.delete({
      where: { id: user.id },
    });

    return NextResponse.json({
      success: true,
      message: `Usuário ${email} deletado com sucesso`,
    });
  } catch (error: any) {
    console.error('Erro ao deletar usuário:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno' },
      { status: 500 }
    );
  }
}
