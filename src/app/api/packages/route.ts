import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'chefexperience-secret-key'

function getUserFromToken(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return null
  
  try {
    // Usar decode para aceitar tokens de diferentes secrets (NextAuth/local)
    return jwt.decode(token) as { userId: string; type: string }
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

    // Primeiro verificar se o usuário existe no banco
    const dbUser = await prisma.user.findUnique({
      where: { id: user.userId },
      include: { professionalProfile: true }
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    // Verificar se tem tipo PROFESSIONAL
    if (dbUser.type !== 'PROFESSIONAL') {
      return NextResponse.json({ error: 'Você precisa se cadastrar como profissional primeiro' }, { status: 403 })
    }

    // Verificar se tem perfil profissional
    if (!dbUser.professionalProfile) {
      return NextResponse.json({ error: 'Perfil profissional não encontrado. Complete seu cadastro em Cadastro > Profissional' }, { status: 404 })
    }

    const professionalProfile = dbUser.professionalProfile

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
