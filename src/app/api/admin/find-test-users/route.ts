import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import jwt from 'jsonwebtoken';
export const dynamic = 'force-dynamic';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'fallback-secret';

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

// GET /api/admin/find-test-users
export async function GET(request: NextRequest) {
  try {
    // Verificar se é admin
    const admin = await isAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const testEmails = [
      'gilmar.guasque@gmail.com',
      'gilmar.meber@gmail.com',
      'gilmar.ribeiro@bmvagas.com.br'
    ];

    const results = [];

    for (const email of testEmails) {
      const user = await prisma.user.findUnique({
        where: { email }
      });
      
      if (user) {
        results.push({
          email,
          found: true,
          id: user.id,
          type: user.type,
          name: user.name,
          isActive: user.isActive,
          createdAt: user.createdAt
        });
      } else {
        results.push({ email, found: false });
      }
    }

    // Buscar todos os usuários que começam com gilmar
    const allGilmarUsers = await prisma.user.findMany({
      where: {
        email: {
          startsWith: 'gilmar'
        }
      },
      select: {
        id: true,
        email: true,
        type: true,
        name: true,
        isActive: true
      }
    });

    return NextResponse.json({ 
      message: 'Busca concluída',
      testUsers: results,
      allGilmarUsers
    });

  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}