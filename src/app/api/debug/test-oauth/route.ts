import { NextRequest, NextResponse } from 'next/server';

// GET /api/debug/test-oauth - Testar fluxo OAuth
export async function GET(request: NextRequest) {
  try {
    // Simular o que o NextAuth faz
    const baseUrl = process.env.NEXTAUTH_URL?.trim() || 'https://chefexperience.vercel.app';
    const callbackUrl = `${baseUrl}/api/auth/callback/google`;
    
    // URL que o Google OAuth usa
    const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` + new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID || '',
      redirect_uri: callbackUrl,
      response_type: 'code',
      scope: 'openid email profile',
    }).toString();
    
    return NextResponse.json({
      status: 'ok',
      baseUrl,
      callbackUrl,
      googleOAuthUrl,
      env: {
        hasClientId: !!process.env.GOOGLE_CLIENT_ID,
        hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
        hasSecret: !!process.env.NEXTAUTH_SECRET,
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}