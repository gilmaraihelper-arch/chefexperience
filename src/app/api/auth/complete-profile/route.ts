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

    // Atualizar usuário usando queryRaw - buscar pelo email que é mais confiável
    const userEmail = session.user.email || body.email;
    
    if (!userEmail) {
      return NextResponse.json(
        { error: 'Email não encontrado na sessão' },
        { status: 400 }
      );
    }
    
    // Primeiro, buscar o usuário pelo email
    const users = await prisma.$queryRaw`
      SELECT id, email FROM "User" WHERE email = ${userEmail} LIMIT 1
    `;
    
    let userId: string;
    
    if (!Array.isArray(users) || users.length === 0) {
      // Criar usuário se não existir
      console.log("🆕 Criando novo usuário...");
      const newUsers = await prisma.$queryRaw`
        INSERT INTO "User" (id, email, name, password, "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), ${userEmail}, ${session.user.name || userEmail.split('@')[0]}, '', NOW(), NOW())
        RETURNING id, email
      `;
      
      if (!Array.isArray(newUsers) || newUsers.length === 0) {
        return NextResponse.json(
          { error: 'Erro ao criar usuário' },
          { status: 500 }
        );
      }
      userId = newUsers[0].id;
    } else {
      userId = users[0].id;
    }
    
    // Agora atualizar pelo ID encontrado
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

    // Se for cliente, criar perfil de cliente
    if (type === 'CLIENT') {
      try {
        await prisma.$queryRaw`
          INSERT INTO "ClientProfile" (id, "userId", "createdAt", "updatedAt")
          VALUES (gen_random_uuid(), ${userId}, NOW(), NOW())
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