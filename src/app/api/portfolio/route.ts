import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'chefexperience-secret-key'

function getUserFromToken(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return null
  
  try {
    return jwt.decode(token) as { userId: string; type: string }
  } catch {
    return null
  }
}

// Listar imagens do portfólio
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const professionalId = searchParams.get('professionalId')

    if (!professionalId) {
      return NextResponse.json({ error: 'professionalId obrigatório' }, { status: 400 })
    }

    const images = await prisma.portfolioImage.findMany({
      where: { professionalId },
      orderBy: [
        { isMain: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json({ images })
  } catch (error) {
    console.error('Erro ao listar imagens:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// Adicionar imagem ao portfólio
export async function POST(request: NextRequest) {
  try {
    const user = getUserFromToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { url, description, isMain } = body

    // Buscar perfil do profissional
    const professional = await prisma.professionalProfile.findUnique({
      where: { userId: user.userId }
    })

    if (!professional) {
      return NextResponse.json({ error: 'Perfil não encontrado' }, { status: 404 })
    }

    // Verificar limite de imagens (5 para free, ilimitado para premium)
    const existingImages = await prisma.portfolioImage.count({
      where: { professionalId: professional.id }
    })

    const maxImages = professional.subscriptionPlan === 'PREMIUM' ? 100 : 5
    
    if (existingImages >= maxImages) {
      return NextResponse.json({ 
        error: `Limite de ${maxImages} imagens atingido. Faça upgrade para Premium!` 
      }, { status: 403 })
    }

    // Se for imagem principal, remover flag das outras
    if (isMain) {
      await prisma.portfolioImage.updateMany({
        where: { professionalId: professional.id },
        data: { isMain: false }
      })
    }

    const image = await prisma.portfolioImage.create({
      data: {
        professionalId: professional.id,
        url,
        description,
        isMain: isMain || false
      }
    })

    return NextResponse.json({ success: true, image })
  } catch (error) {
    console.error('Erro ao adicionar imagem:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// Deletar imagem
export async function DELETE(request: NextRequest) {
  try {
    const user = getUserFromToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const imageId = searchParams.get('id')

    if (!imageId) {
      return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 })
    }

    // Buscar perfil do profissional
    const professional = await prisma.professionalProfile.findUnique({
      where: { userId: user.userId }
    })

    if (!professional) {
      return NextResponse.json({ error: 'Perfil não encontrado' }, { status: 404 })
    }

    // Verificar se a imagem pertence ao profissional
    const image = await prisma.portfolioImage.findFirst({
      where: { id: imageId, professionalId: professional.id }
    })

    if (!image) {
      return NextResponse.json({ error: 'Imagem não encontrada' }, { status: 404 })
    }

    await prisma.portfolioImage.delete({
      where: { id: imageId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar imagem:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
