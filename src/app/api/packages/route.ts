import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'chefexperience-secret-key'

function getUserFromToken(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return null
  
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; type: string }
  } catch {
    return null
  }
}

// Listar pacotes do profissional / Criar pacote
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromToken(request)
    if (!user || user.type !== 'PROFESSIONAL') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const professionalProfile = await prisma.package.findMany({
      where: { professional: { userId: user.userId } },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ packages: professionalProfile })
  } catch (error) {
    console.error('Erro ao listar pacotes:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromToken(request)
    if (!user || user.type !== 'PROFESSIONAL') {
      return NextResponse.json({ error: 'Apenas profissionais podem criar pacotes' }, { status: 403 })
    }

    const professionalProfile = await prisma.professionalProfile.findUnique({
      where: { userId: user.userId }
    })

    if (!professionalProfile) {
      // Criar perfil automaticamente se não existir
      console.log("🔄 Criando perfil profissional automaticamente para:", user.userId);
      try {
        const newProfile = await prisma.professionalProfile.create({
          data: {
            userId: user.userId,
            description: 'Perfil criado automaticamente',
            eventTypes: '["corporativo"]',
            cuisineStyles: '["brasileira"]',
            serviceTypes: '["buffet"]',
            priceRanges: '[200,500]',
            capacity: '50',
          }
        });
        console.log("✅ Perfil profissional criado automaticamente:", newProfile.id);
        return NextResponse.json({ error: 'Perfil criado. Tente criar o pacote novamente.' }, { status: 201 });
      } catch (profileError) {
        console.error("❌ Erro ao criar perfil:", profileError);
        return NextResponse.json({ error: 'Perfil profissional não encontrado' }, { status: 404 });
      }
    }

    const body = await request.json()
    const { name, description, basePrice, minPeople, maxPeople, includes, menuFileUrl } = body

    const pkg = await prisma.package.create({
      data: {
        professionalId: professionalProfile.id,
        name,
        description,
        basePrice: parseFloat(basePrice),
        minPeople: parseInt(minPeople),
        maxPeople: parseInt(maxPeople),
        includes: JSON.stringify(includes || []),
        menuFileUrl,
        isActive: true,
      },
    })

    return NextResponse.json({ success: true, package: pkg })
  } catch (error) {
    console.error('Erro ao criar pacote:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
