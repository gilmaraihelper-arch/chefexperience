import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'chefexperience-secret-key'
const API_VERSION = '2.1-match'

function getUserFromToken(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return null
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; type: string }
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado', version: API_VERSION }, { status: 401 })
    }

    const body = await request.json()
    const { name, eventType, date, guestCount, address } = body

    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId: user.userId }
    })

    if (!clientProfile) {
      return NextResponse.json({ 
        error: 'Perfil de cliente não encontrado', 
        userId: user.userId,
        version: API_VERSION 
      }, { status: 404 })
    }

    const event = await prisma.event.create({
      data: {
        clientId: clientProfile.id,
        name: name || 'Evento sem nome',
        eventType: eventType || 'OUTROS',
        date: date ? new Date(date) : new Date(),
        startTime: '19:00',
        duration: '4',
        billingType: 'PF',
        locationType: 'CLIENT_ADDRESS',
        address: address || 'Endereço não informado',
        city: 'Curitiba',
        state: 'PR',
        hasKitchen: false,
        guestCount: parseInt(guestCount) || 50,
        searchRadiusKm: 50,
        cuisineStyles: '[]',
        serviceTypes: '[]',
        needsWaiter: false,
        needsSoftDrinks: false,
        needsAlcoholicDrinks: false,
        needsDecoration: false,
        needsSoundLight: false,
        needsPhotographer: false,
        needsBartender: false,
        needsSweets: false,
        needsCake: false,
        needsPlatesCutlery: false,
        priceRange: 'MEDIUM',
        referenceImages: '[]',
        status: 'OPEN',
      },
    })

    return NextResponse.json({ success: true, event, version: API_VERSION })
  } catch (error) {
    console.error('Erro ao criar evento:', error)
    return NextResponse.json({ 
      error: 'Erro interno', 
      details: String(error),
      version: API_VERSION 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado', version: API_VERSION }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    if (user.type === 'PROFESSIONAL' && type === 'available') {
      const professionalProfile = await prisma.professionalProfile.findUnique({
        where: { userId: user.userId }
      })

      if (!professionalProfile) {
        return NextResponse.json({ events: [], version: API_VERSION })
      }

      const events = await prisma.event.findMany({
        where: { status: 'OPEN' },
        include: {
          client: { include: { user: { select: { name: true } } } },
          _count: { select: { proposals: true } }
        },
        orderBy: { createdAt: 'desc' }
      })

      // Calcular match para cada evento
      let profCuisines = []
      let profServices = []
      let profPrices = []
      let profCapacity = 0
      
      try {
        profCuisines = JSON.parse(professionalProfile.cuisineStyles || '[]')
      } catch (e) { profCuisines = [] }
      
      try {
        profServices = JSON.parse(professionalProfile.serviceTypes || '[]')
      } catch (e) { profServices = [] }
      
      try {
        profPrices = JSON.parse(professionalProfile.priceRanges || '[]')
      } catch (e) { profPrices = [] }
      
      try {
        profCapacity = parseInt(professionalProfile.capacity || '0')
      } catch (e) { profCapacity = 0 }

      const eventsWithMatch = events.map(event => {
        let score = 0
        let total = 0

        // Match de estilo culinário (30%)
        if (event.cuisineStyles) {
          const eventCuisines = JSON.parse(event.cuisineStyles || '[]')
          const cuisineMatch = eventCuisines.filter((c: string) => profCuisines.includes(c)).length
          if (eventCuisines.length > 0) {
            score += (cuisineMatch / eventCuisines.length) * 30
          }
          total += 30
        }

        // Match de tipo de serviço (25%)
        if (event.serviceTypes) {
          const eventServices = JSON.parse(event.serviceTypes || '[]')
          const serviceMatch = eventServices.filter((s: string) => profServices.includes(s)).length
          if (eventServices.length > 0) {
            score += (serviceMatch / eventServices.length) * 25
          }
          total += 25
        }

        // Match de faixa de preço (25%)
        if (event.priceRange) {
          const priceMap: Record<string, number> = { 'popular': 1, 'medio': 2, 'premium': 3, 'luxo': 4, 'executivo': 3 }
          const eventPrice = priceMap[event.priceRange.toLowerCase()] || 2
          const profPrice = profPrices.length > 0 ? Math.round(profPrices.reduce((a: number, b: number) => a + b, 0) / profPrices.length / 100) : 2
          const priceDiff = Math.abs(eventPrice - profPrice)
          score += Math.max(0, 25 - priceDiff * 8)
          total += 25
        }

        // Match de capacidade (20%)
        if (event.guestCount && profCapacity > 0) {
          if (profCapacity >= event.guestCount) {
            score += 20
          } else {
            score += (profCapacity / event.guestCount) * 20
          }
          total += 20
        }

        // Se não tem nenhum critério, dar match base de 50%
        const matchPercentage = total > 0 ? Math.round((score / total) * 100) : 50

        // Retornar objeto com match
        return {
          id: event.id,
          name: event.name,
          eventType: event.eventType,
          date: event.date,
          guestCount: event.guestCount,
          city: event.city,
          state: event.state,
          priceRange: event.priceRange,
          cuisineStyles: event.cuisineStyles,
          serviceTypes: event.serviceTypes,
          status: event.status,
          client: event.client,
          _count: event._count,
          match: matchPercentage
        }
      })

      return NextResponse.json({ events: eventsWithMatch, version: API_VERSION })
    }

    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId: user.userId }
    })

    if (!clientProfile) {
      return NextResponse.json({ events: [], version: API_VERSION })
    }

    const events = await prisma.event.findMany({
      where: { clientId: clientProfile.id },
      include: {
        proposals: { include: { professional: { include: { user: { select: { name: true } } } } } },
        hiredProposal: true,
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ events, version: API_VERSION })
  } catch (error) {
    console.error('Erro ao listar eventos:', error)
    return NextResponse.json({ error: 'Erro interno', details: String(error), version: API_VERSION }, { status: 500 })
  }
}
