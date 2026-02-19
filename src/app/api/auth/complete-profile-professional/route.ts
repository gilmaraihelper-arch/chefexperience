import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { 
      type, 
      personType, 
      cpf, 
      cnpj, 
      phone, 
      cep, 
      address, 
      number, 
      neighborhood, 
      city, 
      state,
      description 
    } = body;

    // Buscar usuário pelo email
    const users = await prisma.$queryRaw`
      SELECT id FROM "User" WHERE email = ${session.user.email} LIMIT 1
    `;
    
    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }
    
    const userId = users[0].id;
    
    // Atualizar usuário
    const updatedUsers = await prisma.$queryRaw`
      UPDATE "User"
      SET 
        type = ${type}::"UserType",
        "personType" = ${personType}::"PersonType",
        cpf = ${cpf || null},
        cnpj = ${cnpj || null},
        phone = ${phone},
        cep = ${cep},
        address = ${address},
        number = ${number},
        neighborhood = ${neighborhood},
        city = ${city},
        state = ${state},
        "updatedAt" = NOW()
      WHERE id = ${userId}
      RETURNING id, email, name, type
    `;

    const updatedUser = Array.isArray(updatedUsers) ? updatedUsers[0] : null;

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Erro ao atualizar usuário' },
        { status: 500 }
      );
    }

    // Criar perfil de profissional
    try {
      await prisma.$queryRaw`
        INSERT INTO "ProfessionalProfile" (
          id, "userId", description, "createdAt", "updatedAt"
        )
        VALUES (
          gen_random_uuid(), 
          ${userId}, 
          ${description || ''}, 
          NOW(), 
          NOW()
        )
        ON CONFLICT ("userId") DO UPDATE SET
          description = ${description || ''},
          "updatedAt" = NOW()
      `;
    } catch (profileError) {
      console.log('Erro ao criar perfil profissional:', profileError);
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error: any) {
    console.error('Erro ao completar perfil profissional:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno' },
      { status: 500 }
    );
  }
}