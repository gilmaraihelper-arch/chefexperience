import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/admin/find-test-users
export async function GET(request: NextRequest) {
  try {
    // Verificar se é admin
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.type !== 'ADMIN') {
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