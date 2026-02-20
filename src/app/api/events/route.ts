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

    // Após criar o evento, notificar profissionais com match >= 80%
    try {
      // Buscar profissionais com match >= 80%
      const professionals = await prisma.professionalProfile.findMany({
        include: {
          user: {
            select: { name: true, email: true }
          }
        }
      });

      // Calcular matches
      const eventData = { ...body, guestCount: parseInt(guestCount), city };
      const matchedProfess = professionals.map(prof => {
        // Função simplificada de match (replicada aqui para evitar import circular)
        let score = 0;
        
        // Match por estilo culinário
        if (cuisineStyles && prof.cuisineStyles) {
          const eventStyles = cuisineStyles;
          const profStyles = JSON.parse(prof.cuisineStyles);
          const matches = eventStyles.filter((s: string) => profStyles.includes(s));
          if (matches.length > 0) score += 20;
        }
        
        // Match por tipo de evento
        if (eventType && prof.eventTypes) {
          const profTypes = JSON.parse(prof.eventTypes);
          if (profTypes.includes(eventType)) score += 15;
        }
        
        // Match por capacidade
        if (guestCount && prof.capacity) {
          const capacities = JSON.parse(prof.capacity);
          if (Math.max(...capacities) >= parseInt(guestCount)) score += 15;
        }
        
        // Match por orçamento
        if (maxBudget && prof.priceRanges) {
          const budget = parseFloat(maxBudget);
          const ranges = JSON.parse(prof.priceRanges);
          for (const range of ranges) {
            const [min, max] = range.split('-').map((s: string) => parseInt(s.replace(/[^0-9]/g, '')));
            if (budget >= min && budget <= max) {
              score += 20;
              break;
            }
          }
        }
        
        // Match por rating
        if (prof.rating) {
          score += (prof.rating / 5) * 15;
        }
        
        return { professional: prof, score };
      }).filter(m => m.score >= 80).sort((a, b) => b.score - a.score);

      // Enviar emails para profissionais com match >= 80%
      if (matchedProfess.length > 0) {
        const { sendEmail, emailTemplates } = await import('@/lib/email');
        
        for (const match of matchedProfess.slice(0, 5)) { // Max 5 profissionais
          const template = emailTemplates.newEvent({
            professionalName: match.professional.user.name,
            eventTitle: name,
            eventType,
            guestCount: parseInt(guestCount),
            eventDate: date,
            eventId: event.id
          });
          
          await sendEmail({
            to: match.professional.user.email,
            subject: template.subject,
            html: template.html
          });
        }
        
        console.log(`📧 Notificados ${matchedProfess.length} profissionais com match >= 80%`);
      }
    } catch (notifyError) {
      console.error('Erro ao notificar profissionais:', notifyError);
      // Não falha a criação do evento se o notification falhar
    }

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