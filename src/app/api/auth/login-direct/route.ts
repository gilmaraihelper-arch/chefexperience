import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'chefexperience-secret-key'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!user) {
      return NextResponse.json({ error: 'Email ou senha incorretos' }, { status: 401 })
    }
    
    // Verificar senha
    if (!user.password) {
      return NextResponse.json({ error: 'Email ou senha incorretos' }, { status: 401 })
    }
    
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return NextResponse.json({ error: 'Email ou senha incorretos' }, { status: 401 })
    }
    
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
    
    // Buscar perfil
    let profile = null
    if (user.type === 'PROFESSIONAL') {
      profile = await prisma.professionalProfile.findUnique({
        where: { userId: user.id }
      })
    } else if (user.type === 'CLIENT') {
      profile = await prisma.clientProfile.findUnique({
        where: { userId: user.id }
      })
    }
    
    return NextResponse.json({ 
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        type: user.type,
        profile: profile ? { id: profile.id } : null
      }
    })
  } catch (error) {
    console.error('Erro no login:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
