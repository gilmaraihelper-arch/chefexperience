import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'chefexperience-secret-key'

// Endpoint de debug para verificar o estado do sistema
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const check = searchParams.get('check')

    // Verificar banco de dados
    if (check === 'db') {
      const userCount = await prisma.user.count()
      const professionalCount = await prisma.professionalProfile.count()
      const clientCount = await prisma.clientProfile.count()
      const packageCount = await prisma.package.count()
      const eventCount = await prisma.event.count()

      return NextResponse.json({
        status: 'ok',
        database: {
          users: userCount,
          professionals: professionalCount,
          clients: clientCount,
          packages: packageCount,
          events: eventCount,
        }
      })
    }

    // Verificar token
    if (check === 'token') {
      const authHeader = request.headers.get('authorization')
      if (!authHeader) {
        return NextResponse.json({ 
          status: 'error', 
          message: 'No authorization header' 
        })
      }

      const token = authHeader.replace('Bearer ', '')
      try {
        const decoded = jwt.decode(token)
        return NextResponse.json({
          status: 'ok',
          token: decoded,
          valid: true
        })
      } catch (e: any) {
        return NextResponse.json({
          status: 'error',
          message: 'Invalid token',
          error: e.message
        })
      }
    }

    // Verificar profissional específico
    if (check === 'professional') {
      const email = searchParams.get('email')
      if (!email) {
        return NextResponse.json({ 
          status: 'error', 
          message: 'Email required' 
        })
      }

      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          professionalProfile: true
        }
      })

      if (!user) {
        return NextResponse.json({ 
          status: 'error', 
          message: 'User not found' 
        })
      }

      return NextResponse.json({
        status: 'ok',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          type: user.type,
          hasProfessionalProfile: !!user.professionalProfile,
          professionalProfile: user.professionalProfile
        }
      })
    }

    // Default: retornar informações gerais
    return NextResponse.json({
      status: 'ok',
      message: 'Debug endpoint',
      checks: ['db', 'token', 'professional'],
      env: {
        hasJwtSecret: !!process.env.JWT_SECRET,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV,
      }
    })
  } catch (error: any) {
    console.error('Debug error:', error)
    return NextResponse.json({ 
      status: 'error', 
      message: error.message 
    }, { status: 500 })
  }
}
