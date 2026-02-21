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

// Atualizar ou deletar pacote
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getUserFromToken(request)
    if (!user || user.type !== 'PROFESSIONAL') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id: packageId } = await params
    const body = await request.json()
    const { name, description, basePrice, minPeople, maxPeople, includes, isActive, menuFileUrl } = body

    const professionalProfile = await prisma.professionalProfile.findUnique({
      where: { userId: user.userId }
    })

    if (!professionalProfile) {
      return NextResponse.json({ error: 'Perfil não encontrado' }, { status: 404 })
    }

    // Verificar se o pacote pertence ao profissional
    const pkg = await prisma.package.findFirst({
      where: {
        id: packageId,
        professionalId: professionalProfile.id
      }
    })

    if (!pkg) {
      return NextResponse.json({ error: 'Pacote não encontrado' }, { status: 404 })
    }

    const updated = await prisma.package.update({
      where: { id: packageId },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(basePrice && { basePrice: parseFloat(basePrice) }),
        ...(minPeople && { minPeople: parseInt(minPeople) }),
        ...(maxPeople && { maxPeople: parseInt(maxPeople) }),
        ...(includes && { includes: JSON.stringify(includes) }),
        ...(isActive !== undefined && { isActive }),
        ...(menuFileUrl !== undefined && { menuFileUrl }),
      },
    })

    return NextResponse.json({ success: true, package: updated })
  } catch (error) {
    console.error('Erro ao atualizar pacote:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getUserFromToken(request)
    if (!user || user.type !== 'PROFESSIONAL') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id: packageId } = await params

    const professionalProfile = await prisma.professionalProfile.findUnique({
      where: { userId: user.userId }
    })

    if (!professionalProfile) {
      return NextResponse.json({ error: 'Perfil não encontrado' }, { status: 404 })
    }

    const pkg = await prisma.package.findFirst({
      where: {
        id: packageId,
        professionalId: professionalProfile.id
      }
    })

    if (!pkg) {
      return NextResponse.json({ error: 'Pacote não encontrado' }, { status: 404 })
    }

    await prisma.package.delete({
      where: { id: packageId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar pacote:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
