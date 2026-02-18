import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, phone, cep, address, number, complement, neighborhood, city, state } = body;

    // Validar campos obrigatórios
    if (!type || !phone || !cep || !address || !number || !neighborhood || !city || !state) {
      return NextResponse.json(
        { error: 'Preencha todos os campos obrigatórios' },
        { status: 400 }
      );
    }

    // Atualizar usuário
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        type,
        phone,
        cep,
        address,
        number,
        complement,
        neighborhood,
        city,
        state,
        personType: 'PF', // Default para OAuth
      },
    });

    // Se for cliente, criar perfil de cliente
    if (type === 'CLIENT') {
      await prisma.clientProfile.create({
        data: {
          userId: updatedUser.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error: any) {
    console.error('Erro ao completar perfil:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno' },
      { status: 500 }
    );
  }
}
