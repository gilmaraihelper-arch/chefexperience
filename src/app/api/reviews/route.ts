import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'chefexperience-secret-key'

function getUserFromToken(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return null
  
  try {
    const decoded = jwt.decode(token) as { userId?: string; id?: string; type: string }
    return {
      userId: decoded.userId || decoded.id,
      type: decoded.type
    }
  } catch {
    return null
  }
}

// Criar avaliação
export async function POST(request: NextRequest) {
  try {
    const user = getUserFromToken(request)
    if (!user || !user.userId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const {
      targetId, // professionalId ou clientId
      eventId,
      rating,
      comment,
      type // 'CLIENT_TO_PROFESSIONAL' ou 'PROFESSIONAL_TO_CLIENT'
    } = body

    // Verificar se o evento existe e está concluído
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        hiredProposal: true,
        client: true
      }
    })

    if (!event) {
      return NextResponse.json({ error: 'Evento não encontrado' }, { status: 404 })
    }

    if (event.status !== 'COMPLETED' && event.status !== 'CLOSED') {
      return NextResponse.json({ error: 'Evento ainda não foi concluído' }, { status: 400 })
    }

    // Validar permissões baseado no tipo de avaliação
    if (type === 'CLIENT_TO_PROFESSIONAL') {
      if (user.type !== 'CLIENT') {
        return NextResponse.json({ error: 'Apenas clientes podem avaliar profissionais' }, { status: 403 })
      }
      if (event.client?.userId !== user.userId) {
        return NextResponse.json({ error: 'Você não pode avaliar este evento' }, { status: 403 })
      }
      if (event.hiredProposal?.professionalId !== targetId) {
        return NextResponse.json({ error: 'Profissional não contratado para este evento' }, { status: 400 })
      }
    } else if (type === 'PROFESSIONAL_TO_CLIENT') {
      if (user.type !== 'PROFESSIONAL') {
        return NextResponse.json({ error: 'Apenas profissionais podem avaliar clientes' }, { status: 403 })
      }
      // Verificar se o profissional foi o contratado
      const professionalProfile = await prisma.professionalProfile.findUnique({
        where: { userId: user.userId }
      })
      if (!professionalProfile || event.hiredProposal?.professionalId !== professionalProfile.id) {
        return NextResponse.json({ error: 'Você não foi contratado para este evento' }, { status: 403 })
      }
      if (event.client?.userId !== targetId) {
        return NextResponse.json({ error: 'Cliente inválido' }, { status: 400 })
      }
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

    // Criar avaliação
    const review = await prisma.review.create({
      data: {
        reviewerId: user.userId,
        professionalId: type === 'CLIENT_TO_PROFESSIONAL' ? targetId : null,
        clientId: type === 'PROFESSIONAL_TO_CLIENT' ? targetId : null,
        eventId,
        overall: rating,
        foodQuality: rating,
        serviceQuality: rating,
        punctuality: rating,
        communication: rating,
        valueForMoney: rating,
        comment,
        isPublic: true,
      },
    })

    // Se avaliação de profissional, atualizar rating
    if (type === 'CLIENT_TO_PROFESSIONAL') {
      const allReviews = await prisma.review.findMany({
        where: { professionalId: targetId }
      })

      if (allReviews.length > 0) {
        const avgRating = allReviews.reduce((sum, r) => sum + r.overall, 0) / allReviews.length

        await prisma.professionalProfile.update({
          where: { id: targetId },
          data: {
            rating: avgRating,
            reviewCount: allReviews.length,
          },
        })
      }
    }

    // Se avaliação de cliente, salvar no clientProfile
    if (type === 'PROFESSIONAL_TO_CLIENT') {
      const clientReviews = await prisma.review.findMany({
        where: { clientId: targetId }
      })

      if (clientReviews.length > 0) {
        const avgRating = clientReviews.reduce((sum, r) => sum + r.overall, 0) / clientReviews.length

        await prisma.clientProfile.update({
          where: { id: targetId },
          data: {
            rating: avgRating,
          },
        })
      }
    }

    return NextResponse.json({ success: true, review })
  } catch (error) {
    console.error('Erro ao criar avaliação:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// Listar avaliações
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const professionalId = searchParams.get('professionalId')
    const clientId = searchParams.get('clientId')

    let whereClause: any = { isPublic: true }
    
    if (professionalId) {
      whereClause.professionalId = professionalId
    }
    if (clientId) {
      whereClause.clientId = clientId
    }

    if (!professionalId && !clientId) {
      return NextResponse.json({ error: 'professionalId ou clientId obrigatório' }, { status: 400 })
    }

    const reviews = await prisma.review.findMany({
      where: whereClause,
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
