import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'chefexperience-secret-key'

function getUserFromToken(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return null
  
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; type: string }
  } catch {
    return null
  }
}

// Criar proposta (profissional)
export async function POST(request: NextRequest) {
  try {
    const user = getUserFromToken(request)
    if (!user || user.type !== 'PROFESSIONAL') {
      return NextResponse.json({ error: 'Apenas profissionais podem enviar propostas' }, { status: 403 })
    }

    const body = await request.json()
    const { eventId, totalPrice, pricePerPerson, message } = body

    const professionalProfile = await prisma.professionalProfile.findUnique({
      where: { userId: user.userId },
      include: { user: { select: { name: true, email: true } } }
    })

    if (!professionalProfile) {
      return NextResponse.json({ error: 'Perfil não encontrado' }, { status: 404 })
    }

    // Verificar se já existe proposta
    const existing = await prisma.proposal.findUnique({
      where: {
        eventId_professionalId: {
          eventId,
          professionalId: professionalProfile.id,
        }
      }
    })

    if (existing) {
      return NextResponse.json({ error: 'Você já enviou uma proposta para este evento' }, { status: 409 })
    }

    const proposal = await prisma.proposal.create({
      data: {
        eventId,
        professionalId: professionalProfile.id,
        totalPrice: parseFloat(totalPrice),
        pricePerPerson: pricePerPerson ? parseFloat(pricePerPerson) : null,
        message,
      },
    })

    // Notificar cliente sobre nova proposta
    try {
      const event = await prisma.event.findUnique({
        where: { id: eventId },
        include: {
          client: {
            include: { user: true }
          }
        }
      });

      if (event?.client?.user) {
        const { sendEmail, emailTemplates } = await import('@/lib/email');
        
        const template = emailTemplates.proposalReceived({
          clientName: event.client.user.name,
          professionalName: professionalProfile.user.name,
          eventTitle: event.name,
          proposalValue: parseFloat(totalPrice),
          proposalId: proposal.id
        });
        
        await sendEmail({
          to: event.client.user.email,
          subject: template.subject,
          html: template.html
        });
        
        console.log('📧 Email de nova proposta enviado para:', event.client.user.email);
      }
    } catch (notifyError) {
      console.error('Erro ao notificar cliente:', notifyError);
    }

    return NextResponse.json({ success: true, proposal })
  } catch (error) {
    console.error('Erro ao criar proposta:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// Listar propostas
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'sent' ou 'received'

    if (user.type === 'PROFESSIONAL') {
      const professionalProfile = await prisma.professionalProfile.findUnique({
        where: { userId: user.userId },
        include: { user: { select: { name: true, email: true } } }
      })

      if (!professionalProfile) {
        return NextResponse.json({ error: 'Perfil não encontrado' }, { status: 404 })
      }

      const proposals = await prisma.proposal.findMany({
        where: { professionalId: professionalProfile.id },
        include: {
          event: {
            include: {
              client: {
                include: {
                  user: {
                    select: { name: true, city: true, state: true }
                  }
                }
              }
            }
          }
        },
        orderBy: { sentAt: 'desc' }
      })

      return NextResponse.json({ proposals })
    } else {
      // Cliente - ver propostas recebidas
      const clientProfile = await prisma.clientProfile.findUnique({
        where: { userId: user.userId }
      })

      if (!clientProfile) {
        return NextResponse.json({ error: 'Perfil não encontrado' }, { status: 404 })
      }

      const proposals = await prisma.proposal.findMany({
        where: {
          event: {
            clientId: clientProfile.id
          }
        },
        include: {
          event: true,
          professional: {
            include: {
              user: {
                select: { name: true }
              }
            }
          }
        },
        orderBy: { sentAt: 'desc' }
      })

      return NextResponse.json({ proposals })
    }
  } catch (error) {
    console.error('Erro ao listar propostas:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}