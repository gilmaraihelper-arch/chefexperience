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
    // Query raw para evitar problemas de schema
    const users = await prisma.$queryRaw`
      SELECT id, email, name, type FROM "User" WHERE email = ${email} LIMIT 1
    `;
    
    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json({
        exists: false,
        message: 'Usuário não existe no banco'
      });
    }
    
    const user = users[0];
    
    return NextResponse.json({
      exists: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        type: user.type,
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
    }, { status: 500 });
  }
}