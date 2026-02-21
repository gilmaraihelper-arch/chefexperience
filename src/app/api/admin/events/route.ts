import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import jwt from 'jsonwebtoken';
export const dynamic = 'force-dynamic';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'fallback-secret';

// Middleware para verificar se é admin
async function isAdmin(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (token) {
    try {
      const decoded = jwt.decode(token) as { userId?: string; id?: string; sub?: string };
      const userId = decoded?.userId || decoded?.id || decoded?.sub;
      if (userId) {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { type: true },
        });
        if (user?.type === 'ADMIN') return true;
      }
    } catch (e) {
      console.log('Token decode error:', e);
    }
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
  } catch (e) {
    console.log('Erro NextAuth:', e);
  }

  return false;
}

// GET /api/admin/events - Listar todos os eventos
export async function GET(request: NextRequest) {
  try {
    const admin = await isAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: any = {};
    if (status && status !== 'all') {
      where.status = status.toUpperCase();
    }

    const events = await prisma.event.findMany({
      where,
      include: {
        client: {
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
        },
        proposals: {
          select: { id: true, status: true, totalPrice: true },
        },
        hiredProposal: {
          select: { id: true, totalPrice: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedEvents = events.map(event => ({
      id: event.id,
      name: event.name,
      eventType: event.eventType,
      date: event.date,
      guestCount: event.guestCount,
      city: event.city,
      state: event.state,
      status: event.status,
      maxBudget: event.maxBudget,
      client: {
        name: event.client?.user?.name || 'Desconhecido',
        email: event.client?.user?.email || '',
      },
      proposalsCount: event.proposals.length,
      hiredValue: event.hiredProposal?.totalPrice || null,
      createdAt: event.createdAt,
    }));

    return NextResponse.json({ events: formattedEvents });
  } catch (error: any) {
    console.error('Erro ao listar eventos:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/events - Atualizar evento
export async function PATCH(request: NextRequest) {
  try {
    const admin = await isAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID do evento é obrigatório' },
        { status: 400 }
      );
    }

    const allowedFields = ['name', 'status', 'date', 'guestCount', 'city', 'state', 'maxBudget'];
    const updateData: any = {};
    
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    }

    const event = await prisma.event.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, event });
  } catch (error: any) {
    console.error('Erro ao atualizar evento:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/events - Deletar evento
export async function DELETE(request: NextRequest) {
  try {
    const admin = await isAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID do evento é obrigatório' },
        { status: 400 }
      );
    }

    // Deletar propostas primeiro
    await prisma.proposal.deleteMany({
      where: { eventId: id },
    });

    // Deletar evento
    await prisma.event.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Evento deletado' });
  } catch (error: any) {
    console.error('Erro ao deletar evento:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno' },
      { status: 500 }
    );
  }
}