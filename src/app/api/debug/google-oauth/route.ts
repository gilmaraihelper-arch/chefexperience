import { NextRequest, NextResponse } from 'next/server';

// GET /api/debug/google-oauth - Diagnóstico completo do OAuth
export async function GET(request: NextRequest) {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: {
      nodeEnv: process.env.NODE_ENV,
      nextAuthUrl: process.env.NEXTAUTH_URL,
      nextAuthUrlLength: process.env.NEXTAUTH_URL?.length,
      hasNewline: process.env.NEXTAUTH_URL?.includes('\n'),
      hasSecret: !!process.env.NEXTAUTH_SECRET,
      hasGoogleId: !!process.env.GOOGLE_CLIENT_ID,
      hasGoogleSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    },
    googleConfig: {
      clientIdPrefix: process.env.GOOGLE_CLIENT_ID?.substring(0, 20) + '...',
      redirectUri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
    },
    urls: {
      login: `${process.env.NEXTAUTH_URL}/login`,
      callback: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
      completeProfile: `${process.env.NEXTAUTH_URL}/completar-cadastro`,
    }
  };

  return NextResponse.json(diagnostics);
}