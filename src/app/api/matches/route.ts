import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'chefexperience-secret-key';

function getUserFromToken(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return null
  
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; type: string }
  } catch {
    return null
  }
}

// Calcular score de match entre evento e profissional
function calculateMatchScore(event: any, professional: any) {
  let score = 0;
  const reasons: string[] = [];

  // 1. Estilo culinário (20 pontos)
  if (event.cuisineStyles && professional.cuisineStyles) {
    const eventStyles = typeof event.cuisineStyles === 'string' 
      ? JSON.parse(event.cuisineStyles) 
      : event.cuisineStyles;
    const profStyles = typeof professional.cuisineStyles === 'string' 
      ? JSON.parse(professional.cuisineStyles) 
      : professional.cuisineStyles;
    
    const matches = eventStyles.filter((s: string) => profStyles.includes(s));
    if (matches.length > 0) {
      score += (matches.length / eventStyles.length) * 20;
      reasons.push(`Especialista em ${matches.join(', ')}`);
    }
  }

  // 2. Tipo de evento (15 pontos)
  if (event.eventType && professional.eventTypes) {
    const profTypes = typeof professional.eventTypes === 'string' 
      ? JSON.parse(professional.eventTypes) 
      : professional.eventTypes;
    if (profTypes.includes(event.eventType)) {
      score += 15;
      reasons.push('Experiência no tipo de evento');
    }
  }

  // 3. Capacidade de convidados (15 pontos)
  if (event.guestCount && professional.capacity) {
    const capacities = typeof professional.capacity === 'string' 
      ? JSON.parse(professional.capacity) 
      : professional.capacity;
    const maxCapacity = Math.max(...capacities);
    if (maxCapacity >= event.guestCount) {
      score += 15;
      reasons.push(`Capacidade para ${maxCapacity} convidados`);
    }
  }

  // 4. Localização/raio de atendimento (15 pontos)
  if (event.city && professional.serviceRadiusKm) {
    if (event.city.toLowerCase() === professional.city?.toLowerCase()) {
      score += 15;
      reasons.push(`Atende em ${event.city}`);
    }
  }

  // 5. Orçamento (20 pontos)
  if (event.budget && professional.priceRanges) {
    const budget = parseFloat(event.budget);
    const ranges = typeof professional.priceRanges === 'string' 
      ? JSON.parse(professional.priceRanges) 
      : professional.priceRanges;
    
    for (const range of ranges) {
      const [min, max] = range.split('-').map((s: string) => parseInt(s.replace(/[^0-9]/g, '')));
      if (budget >= min && budget <= max) {
        score += 20;
        reasons.push('Orçamento compatível');
        break;
      }
    }
  }

  // 6. Avaliação (15 pontos)
  if (professional.rating) {
    score += (professional.rating / 5) * 15;
  }

  return {
    score: Math.round(score),
    reasons: reasons.slice(0, 3)
  };
}

// GET /api/matches/for-event/:eventId - Top 5 profissionais compatíveis
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');

    if (!eventId) {
      return NextResponse.json({ error: 'ID do evento é obrigatório' }, { status: 400 });
    }

    // Buscar evento
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!event) {
      return NextResponse.json({ error: 'Evento não encontrado' }, { status: 404 });
    }

    // Buscar todos os profissionais ativos
    const professionals = await prisma.professionalProfile.findMany({
      where: { 
        // Adicionar campo de status ativo quando existir
      },
      include: {
        user: {
          select: { name: true, email: true, city: true }
        }
      }
    });

    // Calcular match para cada profissional
    const matches = professionals.map(professional => {
      const match = calculateMatchScore(event, professional);
      return {
        id: professional.id,
        name: professional.user.name,
        rating: professional.rating || 0,
        specialties: professional.cuisineStyles,
        city: professional.user.city,
        capacidade: professional.capacity,
        ...match
      };
    });

    // Ordenar por score e pegar top 5
    const topMatches = matches
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    return NextResponse.json({ 
      eventId,
      matches: topMatches 
    });

  } catch (error) {
    console.error('Match error:', error);
    return NextResponse.json({ error: 'Erro ao calcular matches' }, { status: 500 });
  }
}

// POST /api/matches/notify - Notificar profissionais com match >= 80%
export async function POST(request: NextRequest) {
  try {
    const user = getUserFromToken(request);
    if (!user || user.type !== 'CLIENT') {
      return NextResponse.json({ error: 'Apenas clientes podem notificar' }, { status: 403 });
    }

    const { eventId } = await request.json();

    // Buscar evento
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        client: {
          include: { user: true }
        }
      }
    });

    if (!event) {
      return NextResponse.json({ error: 'Evento não encontrado' }, { status: 404 });
    }

    // Verificar se o evento pertence ao cliente
    if (event.client?.userId !== user.userId) {
      return NextResponse.json({ error: 'Evento não pertence ao cliente' }, { status: 403 });
    }

    // Buscar profissionais
    const professionals = await prisma.professionalProfile.findMany({
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    });

    // Calcular matches e filtrar >= 80%
    const matchedProfess = professionals
      .map(professional => ({
        professional,
        ...calculateMatchScore(event, professional)
      }))
      .filter(m => m.score >= 80)
      .sort((a, b) => b.score - a.score);

    // Aqui seria enviado o email para cada profissional
    // Por enquanto, retornamos a lista
    const notifications = matchedProfess.map(m => ({
      professionalId: m.professional.id,
      professionalName: m.professional.user.name,
      professionalEmail: m.professional.user.email,
      score: m.score,
      reasons: m.reasons
    }));

    return NextResponse.json({ 
      eventId,
      notificationsSent: notifications.length,
      professionals: notifications
    });

  } catch (error) {
    console.error('Notify match error:', error);
    return NextResponse.json({ error: 'Erro ao notificar profissionais' }, { status: 500 });
  }
}
