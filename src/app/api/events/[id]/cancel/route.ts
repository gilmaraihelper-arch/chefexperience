import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'chefexperience-secret-key';

function getUserFromToken(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;
  try {
    const decoded = jwt.decode(token) as { userId?: string; id?: string; type: string };
    return {
      userId: decoded.userId || decoded.id,
      type: decoded.type
    };
  } catch {
    return null;
  }
}

// POST /api/events/[id]/cancel - Cancelar evento
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id: eventId } = await params;

    // Buscar perfil do cliente
    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId: user.userId }
    });

    if (!clientProfile) {
      return NextResponse.json({ error: 'Perfil não encontrado' }, { status: 404 });
    }

    // Verificar se o evento pertence ao cliente
    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        clientId: clientProfile.id
      },
      include: {
        proposals: true
      }
    });

    if (!event) {
      return NextResponse.json({ error: 'Evento não encontrado' }, { status: 404 });
    }

    // Verificar se o evento já está cancelado ou concluído
    if (event.status === 'CANCELLED') {
      return NextResponse.json({ error: 'Evento já está cancelado' }, { status: 400 });
    }

    if (event.status === 'COMPLETED') {
      return NextResponse.json({ error: 'Não é possível cancelar evento concluído' }, { status: 400 });
    }

    // Cancelar evento e rejeitar todas as propostas pendentes
    await prisma.$transaction([
      // Atualizar evento
      prisma.event.update({
        where: { id: eventId },
        data: { status: 'CANCELLED' }
      }),
      // Rejeitar todas as propostas pendentes
      prisma.proposal.updateMany({
        where: {
          eventId: eventId,
          status: 'PENDING'
        },
        data: {
          status: 'REJECTED',
          respondedAt: new Date()
        }
      }),
      // Cancelar proposta contratada se existir
      ...(event.hiredProposalId ? [
        prisma.proposal.update({
          where: { id: event.hiredProposalId },
          data: {
            status: 'REJECTED',
            respondedAt: new Date()
          }
        })
      ] : [])
    ]);

    // Notificar profissionais que enviaram propostas
    try {
      const { createNotification } = await import('@/lib/notifications');
      
      for (const proposal of event.proposals) {
        const professional = await prisma.professionalProfile.findUnique({
          where: { id: proposal.professionalId },
          include: { user: true }
        });

        if (professional?.user) {
          await createNotification({
            userId: professional.user.id,
            type: 'EVENT_CANCELLED',
            title: 'Evento cancelado',
            message: `O evento "${event.name}" foi cancelado pelo cliente.`,
            data: {
              eventId: event.id,
              eventName: event.name
            }
          });
        }
      }
    } catch (notifyError) {
      console.error('Erro ao notificar profissionais:', notifyError);
    }

    return NextResponse.json({
      success: true,
      message: 'Evento cancelado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao cancelar evento:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
