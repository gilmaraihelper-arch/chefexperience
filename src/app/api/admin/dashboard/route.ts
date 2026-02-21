import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import jwt from 'jsonwebtoken';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'fallback-secret';

// Forçar rota dinâmica (não pré-renderizar)
export const dynamic = 'force-dynamic';

// Middleware para verificar se é admin (suporta NextAuth e JWT)
async function isAdmin(req: NextRequest) {
  // Tentar NextAuth primeiro
  const session = await getServerSession(authOptions);
  
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { type: true },
    });
    return user?.type === 'ADMIN';
  }

  // Tentar JWT token do header
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { type: true },
      });
      return user?.type === 'ADMIN';
    } catch {
      // Token inválido
    }
  }

  return false;
}

// GET /api/admin/dashboard - Estatísticas gerais
export async function GET(request: NextRequest) {
  try {
    const admin = await isAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    // Estatísticas de usuários
    const totalUsers = await prisma.user.count();
    const totalClients = await prisma.user.count({ where: { type: 'CLIENT' } });
    const totalProfessionals = await prisma.user.count({ where: { type: 'PROFESSIONAL' } });
    const newUsersToday = await prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    });

    // Estatísticas de eventos
    const totalEvents = await prisma.event.count();
    const eventsToday = await prisma.event.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    });
    const eventsThisMonth = await prisma.event.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    });

    // Estatísticas de propostas
    const totalProposals = await prisma.proposal.count();
    const pendingProposals = await prisma.proposal.count({
      where: { status: 'PENDING' },
    });
    const acceptedProposals = await prisma.proposal.count({
      where: { status: 'ACCEPTED' },
    });

    // Valor total de propostas aceitas
    const acceptedProposalsValue = await prisma.proposal.aggregate({
      where: { status: 'ACCEPTED' },
      _sum: { totalPrice: true },
    });

    // Últimos usuários cadastrados
    const recentUsers = await prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        type: true,
        createdAt: true,
        isActive: true,
      },
    });

    // Últimos eventos criados
    const recentEvents = await prisma.event.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        client: {
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
        },
      },
    });

    return NextResponse.json({
      stats: {
        users: {
          total: totalUsers,
          clients: totalClients,
          professionals: totalProfessionals,
          newToday: newUsersToday,
        },
        events: {
          total: totalEvents,
          today: eventsToday,
          thisMonth: eventsThisMonth,
        },
        proposals: {
          total: totalProposals,
          pending: pendingProposals,
          accepted: acceptedProposals,
          totalValue: acceptedProposalsValue._sum.totalPrice || 0,
        },
      },
      recentUsers,
      recentEvents,
    });
  } catch (error: any) {
    console.error('Erro no dashboard admin:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno' },
      { status: 500 }
    );
  }
}
