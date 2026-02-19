import { NextRequest, NextResponse } from 'next/server';

// GET /api/debug/oauth - Verificar configuração OAuth
export async function GET(request: NextRequest) {
  const configs = {
    googleClientId: process.env.GOOGLE_CLIENT_ID ? '✅ Configurado' : '❌ Não configurado',
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ? '✅ Configurado' : '❌ Não configurado',
    nextauthUrl: process.env.NEXTAUTH_URL || '❌ Não configurado',
    nextauthSecret: process.env.NEXTAUTH_SECRET ? '✅ Configurado' : '❌ Não configurado',
    databaseUrl: process.env.DATABASE_URL ? '✅ Configurado' : '❌ Não configurado',
  };

  return NextResponse.json({
    message: 'Configurações OAuth',
    configs,
    callbackUrl: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
    timestamp: new Date().toISOString(),
  });
}