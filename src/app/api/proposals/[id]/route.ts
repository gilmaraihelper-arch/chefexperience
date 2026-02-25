import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'chefexperience-secret-key'

function getUserFromToken(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return null
  
  try {
    const decoded = jwt.decode(token) as { userId?: string; id?: string; type: string }
    return {
      userId: decoded.userId || decoded.id,
      type: decoded.type
    }
  } catch {
    return null
  }
}

// Aceitar ou recusar proposta
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getUserFromToken(request)
    if (!user || user.type !== 'CLIENT') {
      return NextResponse.json({ error: 'Apenas clientes podem responder propostas' }, { status: 403 })
    }

    const { action } = await request.json() // 'accept' ou 'reject'
    const { id: proposalId } = await params

    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId: user.userId }
    })

    if (!clientProfile) {
      return NextResponse.json({ error: 'Perfil não encontrado' }, { status: 404 })
    }

    // Verificar se a proposta pertence a um evento do cliente
    const proposal = await prisma.proposal.findFirst({
      where: {
        id: proposalId,
        event: {
          clientId: clientProfile.id
        }
      },
      include: { event: true }
    })

    if (!proposal) {
      return NextResponse.json({ error: 'Proposta não encontrada' }, { status: 404 })
    }

    if (action === 'accept') {
      // Aceitar proposta
      await prisma.$transaction([
        // Atualizar proposta
        prisma.proposal.update({
          where: { id: proposalId },
          data: {
            status: 'ACCEPTED',
            respondedAt: new Date(),
          },
        }),
        // Atualizar evento com a proposta contratada
        prisma.event.update({
          where: { id: proposal.eventId },
          data: {
            hiredProposalId: proposalId,
            status: 'CLOSED',
          },
        }),
        // Rejeitar outras propostas
        prisma.proposal.updateMany({
          where: {
            eventId: proposal.eventId,
            id: { not: proposalId },
            status: 'PENDING',
          },
          data: {
            status: 'REJECTED',
            respondedAt: new Date(),
          },
        }),
      ])

      // Notificar profissional que a proposta foi aceita (email + in-app)
      try {
        const professional = await prisma.professionalProfile.findUnique({
          where: { id: proposal.professionalId },
          include: { user: true }
        });

        if (professional?.user) {
          const client = await prisma.user.findUnique({
            where: { id: user.userId }
          });
          
          const { sendEmail, emailTemplates } = await import('@/lib/email');
          
          // Email para o profissional com dados do cliente
          const template = emailTemplates.proposalAccepted({
            professionalName: professional.user.name,
            clientName: client?.name || 'Cliente',
            clientEmail: client?.email,
            clientPhone: client?.phone || undefined,
            eventTitle: proposal.event.name,
            proposalValue: proposal.totalPrice,
            eventId: proposal.eventId
          });
          
          await sendEmail({
            to: professional.user.email,
            subject: template.subject,
            html: template.html
          });
          
          console.log('📧 Email de proposta aceita enviado para:', professional.user.email);
          
          // Email de confirmação para o cliente com dados do profissional
          const clientTemplate = emailTemplates.hiringConfirmed({
            clientName: client?.name || 'Cliente',
            professionalName: professional.user.name,
            professionalEmail: professional.user.email,
            professionalPhone: professional.user.phone || undefined,
            eventTitle: proposal.event.name,
            proposalValue: proposal.totalPrice,
            eventId: proposal.eventId
          });
          
          await sendEmail({
            to: client?.email || '',
            subject: clientTemplate.subject,
            html: clientTemplate.html
          });
          
          console.log('📧 Email de confirmação enviado para:', client?.email);
          
          // Notificação in-app para o profissional
          const { createNotification } = await import('@/lib/notifications');
          await createNotification({
            userId: professional.user.id,
            type: 'PROPOSAL_ACCEPTED',
            title: 'Proposta aceita! 🎉',
            message: `${client?.name || 'Cliente'} aceitou sua proposta de R$ ${proposal.totalPrice.toLocaleString('pt-BR')} para o evento "${proposal.event.name}"`,
            data: {
              proposalId: proposalId,
              eventId: proposal.eventId,
              clientName: client?.name || 'Cliente',
              clientEmail: client?.email,
              clientPhone: client?.phone || undefined,
              value: proposal.totalPrice
            },
            actionUrl: `/dashboard/profissional`
          });
          
          // Notificação in-app para o cliente
          await createNotification({
            userId: user.userId!,
            type: 'HIRING_CONFIRMED',
            title: 'Chef contratado! ✅',
            message: `Você contratou ${professional.user.name} para o evento "${proposal.event.name}" por R$ ${proposal.totalPrice.toLocaleString('pt-BR')}`,
            data: {
              proposalId: proposalId,
              eventId: proposal.eventId,
              professionalName: professional.user.name,
              professionalEmail: professional.user.email,
              professionalPhone: professional.user.phone || undefined,
              value: proposal.totalPrice
            },
            actionUrl: `/dashboard/cliente`
          });
        }
      } catch (notifyError) {
        console.error('Erro ao notificar:', notifyError);
      }

      return NextResponse.json({ success: true, message: 'Proposta aceita!' })
    } else if (action === 'reject') {
      // Recusar proposta
      await prisma.proposal.update({
        where: { id: proposalId },
        data: {
          status: 'REJECTED',
          respondedAt: new Date(),
        },
      })

      return NextResponse.json({ success: true, message: 'Proposta recusada' })
    } else {
      return NextResponse.json({ error: 'Ação inválida' }, { status: 400 })
    }
  } catch (error) {
    console.error('Erro ao responder proposta:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}