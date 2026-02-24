import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'chefexperience-secret-key';

export async function POST(request: NextRequest) {
  try {
    let userId: string | null = null;
    
    // Tentativa 1: Verificar sessão do NextAuth
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
      console.log("📝 Complete profile - autenticado via sessão NextAuth:", session.user.id);
      userId = session.user.id;
    }
    
    // Tentativa 2: Verificar Bearer token no header
    if (!userId) {
      const authHeader = request.headers.get('authorization');
      console.log("🔍 Verificando Authorization header:", authHeader ? "presente" : "ausente");
      
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        try {
          // Verificar token JWT (não apenas decodificar)
          const decoded = jwt.verify(token, JWT_SECRET) as any;
          console.log("✅ Token JWT verificado, userId:", decoded?.userId);
          
          if (decoded?.userId) {
            // Verificar se usuário existe
            const user = await prisma.user.findUnique({ 
              where: { id: decoded.userId },
              select: { id: true }
            });
            
            if (user) {
              userId = user.id;
            } else {
              console.log("❌ Usuário não encontrado para userId:", decoded.userId);
            }
          }
        } catch (jwtError: any) {
          console.log('❌ Token JWT inválido ou expirado:', jwtError.message);
        }
      }
    }
    
    if (!userId) {
      console.log("❌ Complete profile - nenhuma forma de autenticação válida");
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
