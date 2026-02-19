import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
export const dynamic = 'force-dynamic';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Middleware para verificar se é admin
async function isAdmin(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { type: true },
  });

  return user?.type === 'ADMIN';
}

// GET /api/admin/users - Listar todos os usuários
export async function GET(request: NextRequest) {
  try {
    const admin = await isAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';

    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (type) {
      where.type = type;
    }

    const users = await prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        type: true,
        phone: true,
        city: true,
        state: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });

    const total = await prisma.user.count({ where });

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Erro ao listar usuários:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/users - Atualizar usuário
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
        { error: 'ID do usuário é obrigatório' },
        { status: 400 }
      );
    }

    // Campos permitidos para atualização
    const allowedFields = ['name', 'email', 'phone', 'isActive', 'isVerified', 'type'];
    const updateData: any = {};
    
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error('Erro ao atualizar usuário:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users - Deletar usuário
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
        { error: 'ID do usuário é obrigatório' },
        { status: 400 }
      );
    }

    // Não permitir deletar a si mesmo
    const session = await getServerSession(authOptions);
    if (session?.user?.id === id) {
      return NextResponse.json(
        { error: 'Não pode deletar seu próprio usuário' },
        { status: 400 }
      );
    }

    // Deletar registros relacionados primeiro
    await prisma.$transaction([
      // Deletar sessões do NextAuth
      prisma.nextAuthSession.deleteMany({ where: { userId: id } }),
      // Deletar accounts do NextAuth
      prisma.account.deleteMany({ where: { userId: id } }),
      // Deletar notificações
      prisma.notification.deleteMany({ where: { userId: id } }),
      // Deletar mensagens enviadas
      prisma.message.deleteMany({ where: { senderId: id } }),
      prisma.message.deleteMany({ where: { receiverId: id } }),
      // Deletar reviews (o campo é reviewerId, não userId)
      prisma.review.deleteMany({ where: { reviewerId: id } }),
      // Deletar sessões
      prisma.session.deleteMany({ where: { userId: id } }),
      // Deletar o usuário (ProfessionalProfile e ClientProfile são deletados via Cascade)
      prisma.user.delete({ where: { id } }),
    ]);

    return NextResponse.json({ success: true, message: 'Usuário deletado' });
  } catch (error: any) {
    console.error('Erro ao deletar usuário:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno' },
      { status: 500 }
    );
  }
}
