import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'chefexperience-secret-key'

export async function GET(request: NextRequest) {
  try {
    // Tentar obter token do header Authorization
    const authHeader = request.headers.get('authorization')
    const tokenFromHeader = authHeader?.replace('Bearer ', '')
    
    // Se tem token no header, verificar e retornar info do usuário
    if (tokenFromHeader) {
      try {
        const decoded = jwt.verify(tokenFromHeader, JWT_SECRET) as { userId: string; email: string; type: string }
        
        // Buscar dados atualizados do usuário
        const user = await prisma.user.findUnique({
          where: { id: decoded.userId }
        })
        
        if (user) {
          return NextResponse.json({ 
            token: tokenFromHeader,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              type: user.type
            }
          })
        }
      } catch (e) {
        // Token inválido, continua para verificar sessão
      }
    }
    
    // Se não tem token válido no header, tentar obter do cookie ou localStorage via header customizado
    // (O Next.js não consegue acessar localStorage no server, então o frontend deve enviar o token)
    
    // Tentar obter sessão NextAuth (para OAuth logins)
    const { getServerSession } = await import('next-auth')
    const { authOptions } = await import('@/lib/auth')
    
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const user = session.user as any
    
    // Gerar token JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        type: user.type 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return NextResponse.json({ 
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        type: user.type
      }
    })
  } catch (error) {
    console.error('Erro ao gerar token:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
