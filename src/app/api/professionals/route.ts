import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Listar profissionais com filtros (público)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    const state = searchParams.get('state')
    const cuisineStyle = searchParams.get('cuisineStyle')
    const eventType = searchParams.get('eventType')
    const minRating = searchParams.get('minRating')

    const where: any = { isActive: true }

    if (city) where.city = { contains: city, mode: 'insensitive' }
    if (state) where.state = { contains: state, mode: 'insensitive' }
    if (minRating) where.rating = { gte: parseFloat(minRating) }

    const professionals = await prisma.professionalProfile.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            city: true,
            state: true,
          }
        },
        portfolio: {
          where: { isMain: true },
          take: 1,
        },
      },
      orderBy: { rating: 'desc' },
    })

    // Filtrar por cuisineStyle e eventType (JSON)
    let filtered = professionals
    if (cuisineStyle) {
      filtered = filtered.filter(p => {
        const styles = JSON.parse(p.cuisineStyles || '[]')
        return styles.includes(cuisineStyle)
      })
    }
    if (eventType) {
      filtered = filtered.filter(p => {
        const types = JSON.parse(p.eventTypes || '[]')
        return types.includes(eventType)
      })
    }

    return NextResponse.json({ professionals: filtered })
  } catch (error) {
    console.error('Erro ao listar profissionais:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}