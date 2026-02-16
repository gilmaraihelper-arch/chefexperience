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

// Criar avaliação
export async function POST(request: NextRequest) {
  try {
    const user = getUserFromToken(request)
    if (!user || user.type !== 'CLIENT') {
      return NextResponse.json({ error: 'Apenas clientes podem avaliar' }, { status: 403 })
    }

    const body = await request.json()
    const {
      professionalId,
      eventId,
      foodQuality,
      serviceQuality,
      punctuality,
      communication,
      valueForMoney,
      overall,
      comment,
    } = body

    // Verificar se o evento foi realizado e contratado
    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        status: 'COMPLETED',
        hiredProposal: {
          professionalId: professionalId
        }
      }
    })

    if (!event) {
      return NextResponse.json({ error: 'Evento não encontrado ou não concluído' }, { status: 404 })
    }

    // Verificar se já avaliou
    const existingReview = await prisma.review.findUnique({
      where: {
        reviewerId_eventId: {
          reviewerId: user.userId,
          eventId,
        }
      }
    })

    if (existingReview) {
      return NextResponse.json({ error: 'Você já avaliou este evento' }, { status: 409 })
    }

    const review = await prisma.review.create({
      data: {
        reviewerId: user.userId,
        professionalId,
        eventId,
        foodQuality,
        serviceQuality,
        punctuality,
        communication,
        valueForMoney,
        overall,
        comment,
      },
    })

    // Atualizar rating do profissional
    const allReviews = await prisma.review.findMany({
      where: { professionalId }
    })

    const avgRating = allReviews.reduce((sum, r) => sum + r.overall, 0) / allReviews.length

    await prisma.professionalProfile.update({
      where: { id: professionalId },
      data: {
        rating: avgRating,
        reviewCount: allReviews.length,
      },
    })

    return NextResponse.json({ success: true, review })
  } catch (error) {
    console.error('Erro ao criar avaliação:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// Listar avaliações de um profissional
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const professionalId = searchParams.get('professionalId')

    if (!professionalId) {
      return NextResponse.json({ error: 'professionalId obrigatório' }, { status: 400 })
    }

    const reviews = await prisma.review.findMany({
      where: { professionalId, isPublic: true },
      include: {
        reviewer: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ reviews })
  } catch (error) {
    console.error('Erro ao listar avaliações:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}