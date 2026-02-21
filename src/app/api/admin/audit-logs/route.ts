import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import jwt from 'jsonwebtoken';
export const dynamic = 'force-dynamic';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function isAdmin(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (token) {
    try {
      const decoded = jwt.decode(token) as { userId?: string };
      if (decoded?.userId) {
        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
          select: { type: true },
        });
        if (user?.type === 'ADMIN') return true;
      }
    } catch (e) {}
  }

  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { type: true },
      });
      return user?.type === 'ADMIN';
    }
  } catch (e) {}

  return false;
}

// GET /api/admin/audit-logs - Logs de auditoria
export async function GET(request: NextRequest) {
  try {
    const admin = await isAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    // Buscar usuários criados recentemente
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        type: true,
        createdAt: true,
      },
    });

    // Buscar eventos criados recentemente
    const recentEvents = await prisma.event.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        client: {
          include: {
            user: { select: { name: true } },
          },
        },
      },
    });

    // Buscar propostas aceitas recentemente
    const recentProposals = await prisma.proposal.findMany({
      where: { status: 'ACCEPTED' },
      take: 5,
      orderBy: { respondedAt: 'desc' },
      include: {
        event: {
          select: { name: true },
        },
        professional: {
          include: {
            user: { select: { name: true } },
          },
        },
      },
    });

    // Criar logs formatados
    const logs: any[] = [];

    recentUsers.forEach(u => {
      logs.push({
        id: `user-${u.id}`,
        timestamp: u.createdAt,
        action: 'Criação de Usuário',
        user: 'Sistema',
        target: u.name || u.email,
        details: `Novo ${u.type || 'usuário'} registrado`,
      });
    });

    recentEvents.forEach(e => {
      logs.push({
        id: `event-${e.id}`,
        timestamp: e.createdAt,
        action: 'Novo Evento',
        user: e.client?.user?.name || 'Desconhecido',
        target: e.name,
        details: `Evento criado em ${e.city}/${e.state}`,
      });
    });

    recentProposals.forEach(p => {
      logs.push({
        id: `proposal-${p.id}`,
        timestamp: p.respondedAt || p.sentAt,
        action: 'Proposta Aceita',
        user: 'Sistema',
        target: p.event?.name || 'Evento',
        details: `Proposta aceita por ${p.professional?.user?.name || 'Profissional'}`,
      });
    });

    // Ordenar por data
    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({ logs: logs.slice(0, 10) });
  } catch (error: any) {
    console.error('Erro:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}