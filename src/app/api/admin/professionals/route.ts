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

// GET /api/admin/professionals - Listar todos os profissionais
export async function GET(request: NextRequest) {
  try {
    const admin = await isAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const professionals = await prisma.professionalProfile.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true, city: true, state: true, isActive: true, createdAt: true },
        },
        proposals: {
          select: { id: true, status: true },
        },
        reviews: {
          select: { overall: true },
        },
      },
      orderBy: { user: { createdAt: 'desc' } },
    });

    const formattedProfessionals = professionals.map(prof => ({
      id: prof.id,
      userId: prof.userId,
      name: prof.user?.name || 'Desconhecido',
      email: prof.user?.email || '',
      phone: prof.user?.phone || '',
      city: prof.user?.city || '',
      state: prof.user?.state || '',
      isActive: prof.user?.isActive ?? true,
      rating: prof.rating || 0,
      reviewCount: prof.reviewCount || 0,
      totalEvents: prof.totalEvents || 0,
      totalEarned: prof.totalEarned || 0,
      subscriptionPlan: prof.subscriptionPlan || 'FREE',
      proposalsCount: prof.proposals.length,
      description: prof.description || '',
      serviceRadiusKm: prof.serviceRadiusKm || 50,
    }));

    return NextResponse.json({ professionals: formattedProfessionals });
  } catch (error: any) {
    console.error('Erro ao listar profissionais:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/professionals - Atualizar profissional
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
        { error: 'ID do profissional é obrigatório' },
        { status: 400 }
      );
    }

    // Atualizar perfil profissional
    const allowedFields = ['rating', 'reviewCount', 'totalEvents', 'totalEarned', 'subscriptionPlan', 'serviceRadiusKm'];
    const updateData: any = {};
    
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    }

    const professional = await prisma.professionalProfile.update({
      where: { id },
      data: updateData,
    });

    // Atualizar usuário também
    if (data.isActive !== undefined) {
      await prisma.user.update({
        where: { id: professional.userId },
        data: { isActive: data.isActive },
      });
    }

    return NextResponse.json({ success: true, professional });
  } catch (error: any) {
    console.error('Erro ao atualizar profissional:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/professionals - Deletar profissional
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
        { error: 'ID do profissional é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar profissional para pegar userId
    const professional = await prisma.professionalProfile.findUnique({
      where: { id },
    });

    if (!professional) {
      return NextResponse.json(
        { error: 'Profissional não encontrado' },
        { status: 404 }
      );
    }

    // Deletar propostas
    await prisma.proposal.deleteMany({
      where: { professionalId: id },
    });

    // Deletar pacotes
    await prisma.package.deleteMany({
      where: { professionalId: id },
    });

    // Deletar perfil
    await prisma.professionalProfile.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Profissional deletado' });
  } catch (error: any) {
    console.error('Erro ao deletar profissional:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno' },
      { status: 500 }
    );
  }
}