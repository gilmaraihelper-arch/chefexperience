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

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      name, 
      eventType, 
      date, 
      city, 
      state, 
      guestCount,
      address,
      billingType,
      locationType,
      cuisineStyles,
      serviceTypes,
      priceRange
    } = body

    // Buscar perfil do cliente
    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId: user.userId }
    })

    if (!clientProfile) {
      return NextResponse.json({ error: 'Perfil de cliente não encontrado', userId: user.userId }, { status: 404 })
    }

    // Criar evento com todos os campos obrigatórios
    const event = await prisma.event.create({
      data: {
        clientId: clientProfile.id,
        name: name || 'Evento sem nome',
        eventType: eventType || 'OUTROS',
        date: date ? new Date(date) : new Date(),
        startTime: body.startTime || '19:00',
        duration: String(body.duration || 4),
        billingType: billingType || 'PF',
        locationType: locationType || 'CLIENT_ADDRESS',
        address: address || 'Endereço não informado',
        city: city || 'Curitiba',
        state: state || 'PR',
        hasKitchen: body.hasKitchen || false,
        guestCount: parseInt(guestCount) || 50,
        searchRadiusKm: parseInt(body.searchRadiusKm) || 50,
        cuisineStyles: JSON.stringify(cuisineStyles || []),
        serviceTypes: JSON.stringify(serviceTypes || []),
        needsWaiter: body.needsWaiter || false,
        needsSoftDrinks: body.needsSoftDrinks || false,
        needsAlcoholicDrinks: body.needsAlcoholicDrinks || false,
        needsDecoration: body.needsDecoration || false,
        needsSoundLight: body.needsSoundLight || false,
        needsPhotographer: body.needsPhotographer || false,
        needsBartender: body.needsBartender || false,
        needsSweets: body.needsSweets || false,
        needsCake: body.needsCake || false,
        needsPlatesCutlery: body.needsPlatesCutlery || false,
        priceRange: priceRange || 'MEDIUM',
        maxBudget: body.maxBudget ? parseFloat(body.maxBudget) : null,
        description: body.description || null,
        dietaryRestrictions: body.dietaryRestrictions || null,
        referenceImages: '[]',
        status: 'OPEN',
      },
    })

    return NextResponse.json({ success: true, event })
  } catch (error) {
    console.error('Erro ao criar evento:', error)
    return NextResponse.json({ error: 'Erro interno', details: String(error) }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    if (user.type === 'PROFESSIONAL' && type === 'available') {
      const professionalProfile = await prisma.professionalProfile.findUnique({
        where: { userId: user.userId }
      })

      if (!professionalProfile) {
        return NextResponse.json({ error: 'Perfil profissional não encontrado' }, { status: 404 })
      }

      const events = await prisma.event.findMany({
        where: { status: 'OPEN' },
        include: {
          client: {
            include: { user: { select: { name: true } } }
          },
          _count: { select: { proposals: true } }
        },
        orderBy: { createdAt: 'desc' }
      })

      return NextResponse.json({ events })
    }

    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId: user.userId }
    })

    if (!clientProfile) {
      return NextResponse.json({ error: 'Perfil não encontrado' }, { status: 404 })
    }

    const events = await prisma.event.findMany({
      where: { clientId: clientProfile.id },
      include: {
        proposals: { include: { professional: { include: { user: { select: { name: true } } } } } },
        hiredProposal: true,
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ events })
  } catch (error) {
    console.error('Erro ao listar eventos:', error)
    return NextResponse.json({ error: 'Erro interno', details: String(error) }, { status: 500 })
  }
}
