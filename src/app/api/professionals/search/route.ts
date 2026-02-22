import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Buscar profissionais com filtros avançados
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Filtros
    const especialidade = searchParams.get('especialidade')
    const minRating = searchParams.get('minRating')
    const maxPrice = searchParams.get('maxPrice')
    const cidade = searchParams.get('cidade')
    const estado = searchParams.get('estado')
    const eventType = searchParams.get('eventType')
    const cuisineStyle = searchParams.get('cuisineStyle')
    const minEvents = searchParams.get('minEvents')
    const disponibilidade = searchParams.get('disponibilidade') // imediata, esta_semana, este_mes

    // Construir where clause
    let whereClause: any = {
      isActive: true,
      user: { isActive: true }
    }

    // Filtro por especialidade (cuisine styles)
    if (cuisineStyle) {
      whereClause.cuisineStyles = {
        contains: cuisineStyle,
        mode: 'insensitive'
      }
    }

    // Filtro por avaliação mínima
    if (minRating) {
      whereClause.rating = {
        gte: parseFloat(minRating)
      }
    }

    // Filtro por preço máximo
    if (maxPrice) {
      // Aqui você pode implementar lógica baseada nos pacotes do profissional
      // Por enquanto, vamos ignorar este filtro no backend
    }

    // Filtro por localização
    if (cidade) {
      whereClause.user = {
        ...whereClause.user,
        city: {
          contains: cidade,
          mode: 'insensitive'
        }
      }
    }

    if (estado) {
      whereClause.user = {
        ...whereClause.user,
        state: {
          contains: estado,
          mode: 'insensitive'
        }
      }
    }

    // Filtro por tipo de evento
    if (eventType) {
      whereClause.eventTypes = {
        has: eventType
      }
    }

    // Filtro por quantidade mínima de eventos
    if (minEvents) {
      whereClause.totalEvents = {
        gte: parseInt(minEvents)
      }
    }

    // Buscar profissionais
    const professionals = await prisma.professionalProfile.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            city: true,
            state: true,
            image: true
          }
        },
        packages: {
          select: {
            id: true,
            name: true,
            basePrice: true
          },
          take: 3
        },
        reviews: {
          select: {
            overall: true
          },
          where: { isPublic: true }
        }
      },
      orderBy: [
        { rating: 'desc' },
        { totalEvents: 'desc' }
      ],
      take: 50
    })

    // Formatar resposta
    const formattedProfessionals = professionals.map(prof => ({
      id: prof.id,
      name: prof.user.name,
      city: prof.user.city,
      state: prof.user.state,
      image: prof.user.image,
      rating: prof.rating,
      reviewCount: prof.reviewCount,
      totalEvents: prof.totalEvents,
      cuisineStyles: prof.cuisineStyles,
      eventTypes: prof.eventTypes,
      packages: prof.packages,
      // Calcular match score (simulação)
      matchScore: Math.min(95, Math.round(70 + (prof.rating * 5) + Math.min(prof.totalEvents * 0.5, 20)))
    }))

    return NextResponse.json({ 
      professionals: formattedProfessionals,
      count: formattedProfessionals.length
    })
  } catch (error) {
    console.error('Erro ao buscar profissionais:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
