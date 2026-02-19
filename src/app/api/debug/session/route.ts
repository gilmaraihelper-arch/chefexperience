import { NextRequest, NextResponse } from 'next/server';

// GET /api/debug/session - Verificar sessão atual
export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get('next-auth.session-token') || 
                       request.cookies.get('__Secure-next-auth.session-token');
  
  return NextResponse.json({
    hasSessionCookie: !!sessionCookie,
    cookieName: sessionCookie?.name,
    timestamp: new Date().toISOString(),
  });
}