import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const JWT_SECRET = process.env.JWT_SECRET || 'chefexperience-secret-key'

export async function GET(request: NextRequest) {
  try {
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
