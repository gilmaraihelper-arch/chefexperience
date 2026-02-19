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

    // Atualizar usuário usando queryRaw para evitar problemas de schema
    const updatedUsers = await prisma.$queryRaw`
      UPDATE "User"
      SET 
        type = ${type}::"UserType",
        phone = ${phone},
        cep = ${cep},
        address = ${address},
        number = ${number},
        complement = ${complement || null},
        neighborhood = ${neighborhood},
        city = ${city},
        state = ${state},
        "personType" = 'PF'::"PersonType",
        "updatedAt" = NOW()
      WHERE id = ${session.user.id}
      RETURNING id, email, name, type
    `;

    const updatedUser = Array.isArray(updatedUsers) ? updatedUsers[0] : null;

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Se for cliente, criar perfil de cliente
    if (type === 'CLIENT') {
      try {
        await prisma.$queryRaw`
          INSERT INTO "ClientProfile" (id, "userId", "createdAt", "updatedAt")
          VALUES (gen_random_uuid(), ${updatedUser.id}, NOW(), NOW())
          ON CONFLICT ("userId") DO NOTHING
        `;
      } catch (profileError) {
        console.log('Perfil de cliente já existe ou erro:', profileError);
      }
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