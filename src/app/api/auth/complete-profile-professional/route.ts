import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'chefexperience-secret-key';

export async function POST(request: NextRequest) {
  console.log("📝 API complete-profile-professional INICIADA");
  
  try {
    let userEmail: string | null = null;
    let userId: string | null = null;
    
    // Tentativa 1: Verificar sessão do NextAuth
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      console.log("✅ Autenticado via sessão NextAuth:", session.user.email);
      userEmail = session.user.email;
      userId = (session.user as any)?.id || null;
    }
    
    // Tentativa 2: Verificar Bearer token no header
    if (!userEmail) {
      const authHeader = request.headers.get('authorization');
      console.log("🔍 Verificando Authorization header:", authHeader ? "presente" : "ausente");
      
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        try {
          // Verificar token JWT (não apenas decodificar)
          const decoded = jwt.verify(token, JWT_SECRET) as any;
          console.log("✅ Token JWT verificado, userId:", decoded?.userId);
          
          if (decoded?.userId) {
            const user = await prisma.user.findUnique({ 
              where: { id: decoded.userId },
              select: { id: true, email: true, name: true }
            });
            
            if (user) {
              console.log("✅ Usuário encontrado via token JWT:", user.email);
              userEmail = user.email;
              userId = user.id;
            } else {
              console.log("❌ Usuário não encontrado para userId:", decoded.userId);
            }
          }
        } catch (jwtError: any) {
          console.log('❌ Token JWT inválido ou expirado:', jwtError.message);
          
          // Fallback: tentar decodificar sem verificar (para debug)
          try {
            const decoded = jwt.decode(token) as any;
            console.log("🔍 Token decodificado (sem verificação):", { 
              userId: decoded?.userId, 
              email: decoded?.email,
              exp: decoded?.exp,
              iat: decoded?.iat 
            });
          } catch (e) {
            console.log("❌ Erro ao decodificar token:", e);
          }
        }
      }
    }
    
    if (!userEmail) {
      console.log("❌ Nenhuma forma de autenticação válida encontrada");
      return NextResponse.json(
        { error: 'Não autorizado - sessão inválida. Por favor, faça login novamente.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
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
      differentials,
      experience,
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
    } = body;

    // Validações obrigatórias
    if (!personType || !phone) {
      return NextResponse.json(
        { error: 'Tipo de pessoa e telefone são obrigatórios' },
        { status: 400 }
      );
    }

    // Buscar usuário pelo email usando Prisma
    let user = userId 
      ? await prisma.user.findUnique({ where: { id: userId } })
      : await prisma.user.findUnique({ where: { email: userEmail! } });
    
    let finalUserId: string;
    let userName: string;
    
    if (!user) {
      // Criar usuário se não existir
      const name = razaoSocial || nomeFantasia || session?.user?.name || userEmail!.split('@')[0];
      
      user = await prisma.user.create({
        data: {
          email: userEmail!,
          name: name,
          password: '', // OAuth users don't need password
        }
      });
      console.log("✅ Usuário criado:", user.id);
    }
    
    finalUserId = user.id;
    userName = user.name;

    // Atualizar usuário usando Prisma
    user = await prisma.user.update({
      where: { id: finalUserId },
      data: {
        type: 'PROFESSIONAL',
        personType: personType,
        cpf: cpf || null,
        cnpj: cnpj || null,
        phone: phone,
        whatsapp: whatsapp || null,
        cep: cep,
        address: address,
        number: number,
        complement: complement || null,
        neighborhood: neighborhood,
        city: city,
        state: state,
        razaoSocial: razaoSocial || null,
        nomeFantasia: nomeFantasia || null,
      }
    });

    console.log("✅ User atualizado:", user.id);

    // Criar/atualizar ProfessionalProfile usando Prisma
    // Converter arrays para JSON strings
    const eventTypesJson = JSON.stringify(tiposEvento || []);
    const cuisineStylesJson = JSON.stringify(especialidades || []);
    const serviceTypesJson = JSON.stringify(faixaPreco || []); // This should be serviceTypes
    const priceRangesJson = JSON.stringify(faixaPreco || []);
    const capacityJson = JSON.stringify(capacidade || []);
    
    const profileData = {
      userId: finalUserId,
      description: description || '',
      experience: experience || '',
      differentials: differentials || '',
      eventTypes: eventTypesJson,
      cuisineStyles: cuisineStylesJson,
      serviceTypes: serviceTypesJson,
      priceRanges: priceRangesJson,
      capacity: capacityJson,
      hasWaiter: temGarcom || false,
      hasSoftDrinks: temSoftDrinks || false,
      hasAlcoholicDrinks: temBebidaAlcoolica || false,
      hasDecoration: temDecoracao || false,
      hasRental: temLocacao || false,
      hasSoundLight: temSom || false,
      hasPhotographer: temFotografo || false,
      hasBartender: temBartender || false,
      hasSweets: temDoces || false,
      hasCake: temBolo || false,
      hasPlatesCutlery: temPratosTalheres || false,
      serviceRadiusKm: raioAtendimento || 50,
    };

    // Usar upsert para criar ou atualizar
    const profile = await prisma.professionalProfile.upsert({
      where: { userId: finalUserId },
      update: profileData,
      create: profileData
    });

    console.log("✅ ProfessionalProfile criado/atualizado:", profile.id);

    // Verificar se o profile realmente existe no banco
    if (!profile || !profile.id) {
      console.error("❌ Profile não foi criado corretamente");
      return NextResponse.json(
        { error: 'Erro ao salvar perfil no banco de dados' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        type: user.type
      },
      profile: {
        id: profile.id,
        userId: profile.userId
      },
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
