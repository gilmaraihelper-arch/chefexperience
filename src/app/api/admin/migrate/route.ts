import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// POST /api/admin/migrate - Executa migração do Prisma
export async function POST(request: NextRequest) {
  try {
    // Verificar header de autorização (segurança básica)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== 'Bearer migrate-2026') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
    }

    console.log('🚀 Iniciando migração do Prisma...');

    // Executar migrate deploy
    const { stdout, stderr } = await execAsync(
      'cd /Users/gilmaraihelper/.openclaw/workspace/chefexperience && npx prisma migrate deploy',
      { 
        env: { ...process.env, NODE_ENV: 'production' },
        timeout: 120000 
      }
    );

    console.log('✅ Migração concluída!');
    console.log('stdout:', stdout);
    if (stderr) console.log('stderr:', stderr);

    return NextResponse.json({ 
      success: true, 
      message: 'Migração concluída com sucesso!',
      output: stdout,
      errors: stderr || null
    });

  } catch (error: any) {
    console.error('❌ Erro na migração:', error);
    return NextResponse.json(
      { 
        error: 'Erro na migração', 
        details: error.message,
        stderr: error.stderr 
      },
      { status: 500 }
    );
  }
}