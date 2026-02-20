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
      where: { email },
      include: {
        professionalProfile: true,
        clientProfile: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    if (!user.password) {
      return NextResponse.json({ error: 'Usuário sem senha (OAuth?)' }, { status: 400 })
    }

    // Verificar senha
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return NextResponse.json({ error: 'Senha inválida' }, { status: 401 })
    }

    // Gerar token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, type: user.type },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        type: user.type,
        hasProfessionalProfile: !!user.professionalProfile,
        hasClientProfile: !!user.clientProfile,
      }
    })
  } catch (error: any) {
    console.error('Login debug error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
