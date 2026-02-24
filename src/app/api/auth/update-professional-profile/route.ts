import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'chefexperience-secret-key';

export async function PUT(request: NextRequest) {
  try {
    let userId: string | null = null;
    
    // Tentativa 1: Verificar sessão do NextAuth
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
      userId = session.user.id;
    }
    
    // Tentativa 2: Verificar Bearer token no header
    if (!userId) {
      const authHeader = request.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        try {
          const decoded = jwt.verify(token, JWT_SECRET) as any;
          if (decoded?.userId) {
            const user = await prisma.user.findUnique({ 
              where: { id: decoded.userId },
              select: { id: true }
            });
            if (user) userId = user.id;
          }
        } catch (e) {
          console.log('Token JWT inválido');
        }
      }
    }
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      description,
      differentials,
      experience,
      eventTypes,
      cuisineStyles,
      priceRanges,
      capacity,
      hasWaiter,
      hasSoftDrinks,
      hasAlcoholicDrinks,
      hasDecoration,
      hasRental,
      hasSoundLight,
      hasPhotographer,
      hasBartender,
      hasSweets,
      hasCake,
      hasPlatesCutlery,
      serviceRadiusKm,
    } = body;

    // Converter arrays para JSON strings
    const profileData = {
      description: description || '',
      differentials: differentials || '',
      experience: experience || '',
      eventTypes: JSON.stringify(eventTypes || []),
      cuisineStyles: JSON.stringify(cuisineStyles || []),
      serviceTypes: JSON.stringify(priceRanges || []),
      priceRanges: JSON.stringify(priceRanges || []),
      capacity: JSON.stringify(capacity || []),
      hasWaiter: hasWaiter || false,
      hasSoftDrinks: hasSoftDrinks || false,
      hasAlcoholicDrinks: hasAlcoholicDrinks || false,
      hasDecoration: hasDecoration || false,
      hasRental: hasRental || false,
      hasSoundLight: hasSoundLight || false,
      hasPhotographer: hasPhotographer || false,
      hasBartender: hasBartender || false,
      hasSweets: hasSweets || false,
      hasCake: hasCake || false,
      hasPlatesCutlery: hasPlatesCutlery || false,
      serviceRadiusKm: serviceRadiusKm || 50,
    };

    // Atualizar perfil profissional
    const profile = await prisma.professionalProfile.upsert({
      where: { userId: userId },
      update: profileData,
      create: {
        userId: userId,
        ...profileData,
      },
    });

    return NextResponse.json({
      success: true,
      profile: {
        id: profile.id,
        userId: profile.userId,
      },
    });
  } catch (error: any) {
    console.error('Erro ao atualizar perfil profissional:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno' },
      { status: 500 }
    );
  }
}