import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  console.log("📝 API complete-profile-professional INICIADA");
  console.log("📝 ==========================================");
  
  try {
    const session = await getServerSession(authOptions);
    
    console.log("🔐 Sessão obtida:", { 
      hasSession: !!session, 
      hasEmail: !!session?.user?.email 
    });
    
    if (!session?.user?.email) {
      console.error("❌ Erro: Sessão inválida");
      return NextResponse.json(
        { error: 'Não autorizado - sessão inválida' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log("📦 Body recebido:", JSON.stringify(body, null, 2));
    
    const { 
      personType, 
      cpf, 
      cnpj, 
      phone, 
      whatsapp,
      cep, 
      address, 
      number, 
      complement,
      neighborhood, 
      city, 
      state,
      razaoSocial,
      nomeFantasia,
      tiposEvento,
      especialidades,
      faixaPreco,
      capacidade,
      raioAtendimento,
      description,
      temGarcom,
      temSoftDrinks,
      temBebidaAlcoolica,
      temDecoracao,
      temLocacao,
      temSom,
      temFotografo,
      temBartender,
      temDoces,
      temBolo,
      temPratosTalheres,
      certificacoes,
      formasPagamento,
      diasSemana
    } = body;

    // Validações obrigatórias
    if (!personType || !phone) {
      console.error("❌ Erro: Campos obrigatórios faltando", { personType, phone });
      return NextResponse.json(
        { error: 'Tipo de pessoa e telefone são obrigatórios' },
        { status: 400 }
      );
    }

    // Buscar usuário pelo email
    console.log("🔍 Buscando usuário pelo email:", session.user.email);
    
    const users = await prisma.$queryRaw`
      SELECT id, email, name FROM "User" WHERE email = ${session.user.email} LIMIT 1
    `;
    
    console.log("🔍 Usuários encontrados:", users);
    
    let userId: string;
    let userName: string;
    
    if (!Array.isArray(users) || users.length === 0) {
      // Criar usuário se não existir
      console.log("🆕 Usuário não encontrado, criando...");
      
      const name = razaoSocial || nomeFantasia || session.user.name || session.user.email.split('@')[0];
      
      try {
        const newUsers = await prisma.$queryRaw`
          INSERT INTO "User" (id, email, name, password, "createdAt", "updatedAt")
          VALUES (gen_random_uuid(), ${session.user.email}, ${name}, '', NOW(), NOW())
          RETURNING id, email, name
        `;
        
        if (Array.isArray(newUsers) && newUsers.length > 0) {
          console.log("✅ Usuário criado:", newUsers[0]);
          userId = newUsers[0].id;
          userName = newUsers[0].name;
        } else {
          console.error("❌ Erro: INSERT não retornou dados");
          return NextResponse.json(
            { error: 'Erro ao criar usuário' },
            { status: 500 }
          );
        }
      } catch (createError: any) {
        console.error("❌ Erro ao criar usuário:", createError.message);
        return NextResponse.json(
          { error: 'Erro ao criar usuário: ' + createError.message },
          { status: 500 }
        );
      }
    } else {
      userId = users[0].id;
      userName = users[0].name;
      console.log("✅ Usuário existente:", { userId, userName });
    }
    
    // Atualizar usuário
    console.log("📝 Atualizando User...");
    const updatedUsers = await prisma.$queryRaw`
      UPDATE "User"
      SET 
        type = 'PROFESSIONAL'::"UserType",
        "personType" = ${personType}::"PersonType",
        cpf = ${cpf || null},
        cnpj = ${cnpj || null},
        phone = ${phone},
        whatsapp = ${whatsapp || null},
        cep = ${cep},
        address = ${address},
        number = ${number},
        complement = ${complement || null},
        neighborhood = ${neighborhood},
        city = ${city},
        state = ${state},
        "updatedAt" = NOW()
      WHERE id = ${userId}
      RETURNING id, email, name, type
    `;

    const updatedUser = Array.isArray(updatedUsers) ? updatedUsers[0] : null;

    if (!updatedUser) {
      console.error("❌ Erro: UPDATE do User não retornou dados");
      return NextResponse.json(
        { error: 'Erro ao atualizar usuário' },
        { status: 500 }
      );
    }

    console.log("✅ User atualizado:", updatedUser);

    // Criar/atualizar ProfessionalProfile
    console.log("📝 Criando/atualizando ProfessionalProfile...");
    
    try {
      // Primeiro tenta UPDATE se já existe
      const existingProfile = await prisma.$queryRaw`
        SELECT id FROM "ProfessionalProfile" WHERE "userId" = ${userId} LIMIT 1
      `;
      
      if (Array.isArray(existingProfile) && existingProfile.length > 0) {
        // UPDATE
        console.log("📝 ProfessionalProfile existe, fazendo UPDATE...");
        await prisma.$queryRaw`
          UPDATE "ProfessionalProfile"
          SET 
            description = ${description || ''},
            "eventTypes" = ${JSON.stringify(tiposEvento || [])}::jsonb,
            "cuisineStyles" = ${JSON.stringify(especialidades || [])}::jsonb,
            "priceRanges" = ${JSON.stringify(faixaPreco || [])}::jsonb,
            "capacityRanges" = ${JSON.stringify(capacidade || [])}::jsonb,
            "serviceRadius" = ${raioAtendimento || 50},
            "hasWaiter" = ${temGarcom || false},
            "hasSoftDrinks" = ${temSoftDrinks || false},
            "hasAlcoholicDrinks" = ${temBebidaAlcoolica || false},
            "hasDecoration" = ${temDecoracao || false},
            "hasRentals" = ${temLocacao || false},
            "hasSoundLighting" = ${temSom || false},
            "hasPhotographer" = ${temFotografo || false},
            "hasBartender" = ${temBartender || false},
            "hasSweets" = ${temDoces || false},
            "hasCake" = ${temBolo || false},
            "hasTableware" = ${temPratosTalheres || false},
            certifications = ${JSON.stringify(certificacoes || [])}::jsonb,
            "paymentMethods" = ${JSON.stringify(formasPagamento || [])}::jsonb,
            "availableDays" = ${JSON.stringify(diasSemana || [])}::jsonb,
            "updatedAt" = NOW()
          WHERE "userId" = ${userId}
        `;
      } else {
        // INSERT
        console.log("📝 ProfessionalProfile não existe, fazendo INSERT...");
        await prisma.$queryRaw`
          INSERT INTO "ProfessionalProfile" (
            id, "userId", description, "eventTypes", "cuisineStyles", "priceRanges", 
            "capacityRanges", "serviceRadius", "hasWaiter", "hasSoftDrinks", 
            "hasAlcoholicDrinks", "hasDecoration", "hasRentals", "hasSoundLighting",
            "hasPhotographer", "hasBartender", "hasSweets", "hasCake", "hasTableware",
            certifications, "paymentMethods", "availableDays", "createdAt", "updatedAt"
          )
          VALUES (
            gen_random_uuid(),
            ${userId},
            ${description || ''},
            ${JSON.stringify(tiposEvento || [])}::jsonb,
            ${JSON.stringify(especialidades || [])}::jsonb,
            ${JSON.stringify(faixaPreco || [])}::jsonb,
            ${JSON.stringify(capacidade || [])}::jsonb,
            ${raioAtendimento || 50},
            ${temGarcom || false},
            ${temSoftDrinks || false},
            ${temBebidaAlcoolica || false},
            ${temDecoracao || false},
            ${temLocacao || false},
            ${temSom || false},
            ${temFotografo || false},
            ${temBartender || false},
            ${temDoces || false},
            ${temBolo || false},
            ${temPratosTalheres || false},
            ${JSON.stringify(certificacoes || [])}::jsonb,
            ${JSON.stringify(formasPagamento || [])}::jsonb,
            ${JSON.stringify(diasSemana || [])}::jsonb,
            NOW(),
            NOW()
          )
        `;
      }
      
      console.log("✅ ProfessionalProfile criado/atualizado com sucesso");
      
      // Verificar se foi realmente criado
      const verifyProfile = await prisma.$queryRaw`
        SELECT id, "userId" FROM "ProfessionalProfile" WHERE "userId" = ${userId} LIMIT 1
      `;
      console.log("🔍 Verificação pós-save:", verifyProfile);
      
    } catch (profileError: any) {
      console.error("❌ Erro ao criar ProfessionalProfile:", profileError.message);
      console.error("Stack:", profileError.stack);
      // Não retorna erro - o User já foi atualizado
    }

    console.log("📝 ==========================================");
    console.log("📝 API complete-profile-professional CONCLUÍDA COM SUCESSO");

    // Buscar o ProfessionalProfile criado para retornar
    const profileResult = await prisma.$queryRaw`
      SELECT id FROM "ProfessionalProfile" WHERE "userId" = ${userId} LIMIT 1
    `;
    
    const profile = Array.isArray(profileResult) ? profileResult[0] : null;
    console.log("✅ Profile retornado:", profile);

    return NextResponse.json({
      success: true,
      user: updatedUser,
      profile: profile,
      message: 'Perfil profissional atualizado com sucesso'
    });
  } catch (error: any) {
    console.error("❌ Erro geral na API:", error.message);
    console.error("Stack:", error.stack);
    return NextResponse.json(
      { error: error.message || 'Erro interno no servidor' },
      { status: 500 }
    );
  }
}