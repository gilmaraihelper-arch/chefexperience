import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'chefexperience-secret-key'

export async function GET(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) {
    return NextResponse.json({ error: 'No token' }, { status: 401 })
  }
  
  try {
    const decoded = jwt.decode(token) as { userId?: string; id?: string; type: string }
    const userId = decoded.userId || decoded.id
    
    if (decoded.type === 'CLIENT') {
      const profile = await prisma.clientProfile.findUnique({
        where: { userId: userId }
      })
      return NextResponse.json({ profile, userId: userId, type: decoded.type })
    } else {
      const profile = await prisma.professionalProfile.findUnique({
        where: { userId: userId }
      })
      return NextResponse.json({ profile, userId: userId, type: decoded.type })
    }
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
