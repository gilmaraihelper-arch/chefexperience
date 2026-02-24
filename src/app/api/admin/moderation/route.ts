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

// GET /api/admin/moderation - Conteúdo para moderação
export async function GET(request: NextRequest) {
  try {
    const admin = await isAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    // Buscar avaliações recentes
    const recentReviews = await prisma.review.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        reviewer: {
          select: { name: true },
        },
        professional: {
          include: {
            user: { select: { name: true } },
          },
        },
      },
    });

    // Formatar como itens de moderação
    const items = recentReviews.map((r, idx) => ({
      id: r.id,
      type: r.overall < 3 ? 'REVIEW_NEGATIVE' : 'REVIEW',
      content: r.comment || 'Avaliação sem comentário',
      user: r.reviewer?.name || 'Anônimo',
      target: r.professional?.user?.name || 'Profissional',
      date: r.createdAt,
      priority: r.overall < 3 ? 'high' : 'low',
      status: 'pending',
    }));

    return NextResponse.json({ items });
  } catch (error: any) {
    console.error('Erro:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/admin/moderation - Aprovar/Rejeitar item
export async function POST(request: NextRequest) {
  try {
    const admin = await isAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const body = await request.json();
    const { id, action, notes } = body;

    if (action === 'delete') {
      // Deletar avaliação
      await prisma.review.delete({
        where: { id },
      });
    }

    return NextResponse.json({
      success: true,
      message: action === 'approve' ? 'Item aprovado' : 'Item removido',
    });
  } catch (error: any) {
    console.error('Erro:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}