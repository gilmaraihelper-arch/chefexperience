import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')
  
  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 })
  }
  
  const user = await prisma.user.findUnique({
    where: { email },
    include: { professionalProfile: true, clientProfile: true }
  })
  
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }
  
  return NextResponse.json({ 
    id: user.id,
    email: user.email,
    name: user.name,
    type: user.type,
    hasProfessionalProfile: !!user.professionalProfile,
    hasClientProfile: !!user.clientProfile
  })
}
