import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'chefexperience-secret-key'

// Middleware para verificar token
function getUserFromToken(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return null
  
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; type: string }
  } catch {
    return null
  }
}

// Criar evento
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
      startTime,
      duration,
      billingType,
      locationType,
      address,
      city,
      state,
      hasKitchen,
      guestCount,
      searchRadiusKm,
      cuisineStyles,
      serviceTypes,
      needsWaiter,
      needsSoftDrinks,
      needsAlcoholicDrinks,
      needsDecoration,
      needsSoundLight,
      needsPhotographer,
      needsBartender,
      needsSweets,
      needsCake,
      needsPlatesCutlery,
      priceRange,
      maxBudget,
      description,
      dietaryRestrictions,
    } = body

    // Buscar perfil do cliente
    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId: user.userId }
    })

    if (!clientProfile) {
      return NextResponse.json({ error: 'Perfil de cliente não encontrado' }, { status: 404 })
    }

    const event = await prisma.event.create({
      data: {
        clientId: clientProfile.id,
        name,
        eventType,
        date: new Date(date),
        startTime,
        duration,
        billingType,
        locationType,
        address,
        city,
        state,
        hasKitchen: hasKitchen || false,
        guestCount: parseInt(guestCount),
        searchRadiusKm: parseInt(searchRadiusKm) || 50,
        cuisineStyles: JSON.stringify(cuisineStyles || []),
        serviceTypes: JSON.stringify(serviceTypes || []),
        needsWaiter: needsWaiter || false,
        needsSoftDrinks: needsSoftDrinks || false,
        needsAlcoholicDrinks: needsAlcoholicDrinks || false,
        needsDecoration: needsDecoration || false,
        needsSoundLight: needsSoundLight || false,
        needsPhotographer: needsPhotographer || false,
        needsBartender: needsBartender || false,
        needsSweets: needsSweets || false,
        needsCake: needsCake || false,
        needsPlatesCutlery: needsPlatesCutlery || false,
        priceRange,
        maxBudget: maxBudget ? parseFloat(maxBudget) : null,
        description,
        dietaryRestrictions,
        referenceImages: '[]',
      },
    })

    return NextResponse.json({ success: true, event })
  } catch (error) {
    console.error('Erro ao criar evento:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// Listar eventos do cliente
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
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
        proposals: {
          include: {
            professional: {
              include: {
                user: {
                  select: { name: true }
                }
              }
            }
          }
        },
        hiredProposal: true,
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ events })
  } catch (error) {
    console.error('Erro ao listar eventos:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}