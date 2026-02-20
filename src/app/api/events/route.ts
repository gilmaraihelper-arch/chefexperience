import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'chefexperience-secret-key'
const API_VERSION = '2.0-fixed'

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
        return NextResponse.json({ error: 'Perfil profissional não encontrado', version: API_VERSION }, { status: 404 })
      }

      const events = await prisma.event.findMany({
        where: { status: 'OPEN' },
        include: {
          client: { include: { user: { select: { name: true } } } },
          _count: { select: { proposals: true } }
        },
        orderBy: { createdAt: 'desc' }
      })

      return NextResponse.json({ events, version: API_VERSION })
    }

    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId: user.userId }
    })

    if (!clientProfile) {
      return NextResponse.json({ error: 'Perfil não encontrado', version: API_VERSION }, { status: 404 })
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
