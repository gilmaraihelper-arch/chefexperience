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

// GET /api/admin/settings - Configurações do sistema
export async function GET(request: NextRequest) {
  try {
    const admin = await isAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    // Buscar estatísticas gerais
    const stats = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { type: 'PROFESSIONAL' } }),
      prisma.event.count(),
      prisma.proposal.count({ where: { status: 'ACCEPTED' } }),
    ]);

    return NextResponse.json({
      settings: {
        siteName: 'Chef Experience',
        maintenanceMode: false,
        allowNewRegistrations: true,
        defaultCommission: 10,
        supportEmail: 'suporte@chefexperience.com',
        systemStats: {
          totalUsers: stats[0],
          totalProfessionals: stats[1],
          totalEvents: stats[2],
          totalProposals: stats[3],
        },
      },
    });
  } catch (error: any) {
    console.error('Erro:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH /api/admin/settings - Atualizar configurações
export async function PATCH(request: NextRequest) {
  try {
    const admin = await isAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const body = await request.json();
    
    // Aqui você pode salvar configurações em um arquivo ou banco
    // Por enquanto, apenas retornamos sucesso
    
    return NextResponse.json({
      success: true,
      message: 'Configurações atualizadas',
      settings: body,
    });
  } catch (error: any) {
    console.error('Erro:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}