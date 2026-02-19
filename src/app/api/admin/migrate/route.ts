import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export const dynamic = 'force-dynamic';


// POST /api/admin/migrate - Executa migração usando Prisma Client
export async function POST(request: NextRequest) {
  try {
    // Verificar header de autorização
    const authHeader = request.headers.get('authorization');
    if (authHeader !== 'Bearer migrate-2026') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
    }

    console.log('🚀 Iniciando atualização do schema...');

    // Verificar se a tabela User existe e seus campos
    const result = await prisma.$queryRaw`
      SELECT column_name, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'User' 
      AND column_name IN ('type', 'personType', 'cep', 'address', 'number', 'neighborhood', 'city', 'state')
    `;

    console.log('Colunas atuais:', result);

    // Alterar colunas para permitir NULL
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "User" 
      ALTER COLUMN "type" DROP NOT NULL,
      ALTER COLUMN "personType" DROP NOT NULL,
      ALTER COLUMN "cep" DROP NOT NULL,
      ALTER COLUMN "address" DROP NOT NULL,
      ALTER COLUMN "number" DROP NOT NULL,
      ALTER COLUMN "neighborhood" DROP NOT NULL,
      ALTER COLUMN "city" DROP NOT NULL,
      ALTER COLUMN "state" DROP NOT NULL
    `);

    console.log('✅ Colunas alteradas para opcionais!');

    // Verificar novamente
    const resultAfter = await prisma.$queryRaw`
      SELECT column_name, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'User' 
      AND column_name IN ('type', 'personType', 'cep', 'address', 'number', 'neighborhood', 'city', 'state')
    `;

    return NextResponse.json({ 
      success: true, 
      message: 'Schema atualizado com sucesso!',
      before: result,
      after: resultAfter
    });

  } catch (error: any) {
    console.error('❌ Erro na migração:', error);
    return NextResponse.json(
      { 
        error: 'Erro na migração', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}