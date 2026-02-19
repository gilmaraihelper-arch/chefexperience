import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    console.log("📝 Complete profile professional - session:", { 
      hasSession: !!session, 
      hasEmail: !!session?.user?.email 
    });
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log("📝 Complete profile professional - body:", body);
    
    const { 
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
      raioAtendimento
    } = body;
    
    console.log("📝 Recebendo raioAtendimento:", raioAtendimento);

    // Buscar usuário pelo email
    console.log("🔍 Buscando usuário pelo email:", session.user.email);
    
    const users = await prisma.$queryRaw`
      SELECT id, email FROM "User" WHERE email = ${session.user.email} LIMIT 1
    `;
    
    console.log("🔍 Usuários encontrados:", users);
    
    let userId: string;
    
    if (!Array.isArray(users) || users.length === 0) {
      // Tentar criar usuário se não existir
      console.log("🆕 Usuário não encontrado, criando...");
      
      try {
        const newUsers = await prisma.$queryRaw`
          INSERT INTO "User" (id, email, name, "createdAt", "updatedAt")
          VALUES (gen_random_uuid(), ${session.user.email}, ${session.user.name || session.user.email.split('@')[0]}, NOW(), NOW())
          RETURNING id, email
        `;
        
        if (Array.isArray(newUsers) && newUsers.length > 0) {
          console.log("✅ Usuário criado:", newUsers[0]);
          userId = newUsers[0].id;
        } else {
          return NextResponse.json(
            { error: 'Erro ao criar usuário' },
            { status: 500 }
          );
        }
      } catch (createError) {
        console.error("❌ Erro ao criar usuário:", createError);
        return NextResponse.json(
          { error: 'Usuário não encontrado e não pôde ser criado' },
          { status: 404 }
        );
      }
    } else {
      userId = users[0].id;
    }
    
    const updatedUsers = await prisma.$queryRaw`
      UPDATE "User"
      SET 
        type = 'PROFESSIONAL'::"UserType",
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