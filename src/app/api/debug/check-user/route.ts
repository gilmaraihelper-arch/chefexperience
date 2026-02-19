import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/debug/check-user?email=xxx - Verificar se usuário existe
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  
  if (!email) {
    return NextResponse.json({ error: 'Email obrigatório' }, { status: 400 });
  }
  
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      return NextResponse.json({
        exists: false,
        message: 'Usuário não existe no banco'
      });
    }
    
    // Buscar accounts separadamente
    const accounts = await prisma.account.findMany({
      where: { userId: user.id },
    });
    
    return NextResponse.json({
      exists: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        type: user.type,
        hasPassword: !!user.password,
        accountsCount: accounts.length,
        accounts: accounts.map(a => ({
          provider: a.provider,
          providerAccountId: a.providerAccountId?.substring(0, 10) + '...',
        }))
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
    }, { status: 500 });
  }
}