import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    console.log("📝 Complete profile - session:", { 
      hasSession: !!session, 
      hasUser: !!session?.user,
      userId: session?.user?.id,
      userEmail: session?.user?.email 
    });
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado - sessão inválida' },
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

    const userId = session.user.id;
    const userEmail = session.user.email;
    
    // Atualizar usuário usando Prisma
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        type: type,
        phone: phone,
        cep: cep,
        address: address,
        number: number,
        complement: complement || null,
        neighborhood: neighborhood,
        city: city,
        state: state,
        personType: 'PF',
      }
    });

    console.log("✅ Usuário atualizado:", updatedUser.id);

    // Se for cliente, criar perfil de cliente
    if (type === 'CLIENT') {
      try {
        await prisma.clientProfile.upsert({
          where: { userId: userId },
          update: {},
          create: {
            userId: userId,
          }
        });
        console.log("✅ Perfil de cliente criado/atualizado");
      } catch (profileError) {
        console.log('Erro ao criar perfil de cliente:', profileError);
      }
    }

    // Se for profissional, criar perfil de profissional
    if (type === 'PROFESSIONAL') {
      try {
        await prisma.professionalProfile.upsert({
          where: { userId: userId },
          update: {},
          create: {
            userId: userId,
            description: '',
            eventTypes: '["corporativo"]',
            cuisineStyles: '["brasileira"]',
            serviceTypes: '["buffet"]',
            priceRanges: '[200,500]',
            capacity: '50',
          }
        });
        console.log("✅ Perfil de profissional criado/atualizado");
      } catch (profileError) {
        console.log('Erro ao criar perfil de profissional:', profileError);
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        type: updatedUser.type
      },
    });
  } catch (error: any) {
    console.error('Erro ao completar perfil:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno' },
      { status: 500 }
    );
  }
}
