import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'chefexperience-secret-key'
const API_VERSION = '2.2-match-fixed'

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

      // Parse dos arrays do profissional
      let profCuisines: string[] = []
      let profServices: string[] = []
      let profCapacity = 0
      
      try {
        profCuisines = JSON.parse(professionalProfile.cuisineStyles || '[]')
      } catch (e) { profCuisines = [] }
      
      try {
        profServices = JSON.parse(professionalProfile.serviceTypes || '[]')
      } catch (e) { profServices = [] }
      
      try {
        profCapacity = parseInt(professionalProfile.capacity || '0')
      } catch (e) { profCapacity = 0 }

      // Calcular match para cada evento
      const eventsWithMatch = events.map(event => {
        // Match base de 50%
        let matchScore = 50
        
        // Parse dos arrays do evento
        let eventCuisines: string[] = []
        let eventServices: string[] = []
        
        try {
          eventCuisines = JSON.parse(event.cuisineStyles || '[]')
        } catch(e) { eventCuisines = [] }
        
        try {
          eventServices = JSON.parse(event.serviceTypes || '[]')
        } catch(e) { eventServices = [] }
        
        // Calcular match de estilos (max +25%)
        if (eventCuisines.length > 0 && profCuisines.length > 0) {
          const matches = eventCuisines.filter((c: string) => profCuisines.includes(c)).length
          matchScore += (matches / eventCuisines.length) * 25
        }
        
        // Calcular match de servicos (max +15%)
        if (eventServices.length > 0 && profServices.length > 0) {
          const matches = eventServices.filter((s: string) => profServices.includes(s)).length
          matchScore += (matches / eventServices.length) * 15
        }
        
        // Capacidade (max +10%)
        if (profCapacity > 0 && event.guestCount && profCapacity >= event.guestCount) {
          matchScore += 10
        }
        
        // Calcular orcamento max baseado no priceRange
        const priceRangeMap: Record<string, number> = {
          'popular': 3000,
          'medio': 8000,
          'premium': 15000,
          'luxo': 30000,
          'executivo': 20000
        }
        const maxBudget = priceRangeMap[event.priceRange?.toLowerCase() || 'medio'] || 8000
        
        return {
          id: event.id,
          name: event.name,
          eventType: event.eventType,
          date: event.date,
          guestCount: event.guestCount,
          city: event.city,
          state: event.state,
          priceRange: event.priceRange,
          maxBudget: maxBudget,
          cuisineStyles: event.cuisineStyles,
          serviceTypes: event.serviceTypes,
          status: event.status,
          client: event.client,
          _count: event._count,
          match: Math.min(100, Math.round(matchScore))
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