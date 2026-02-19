import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// DELETE /api/admin/delete-users-bulk
export async function DELETE(request: NextRequest) {
  try {
    // Verificar se é admin
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.type !== 'ADMIN') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const emails = [
      'gilmar.guasque@gmail.com',
      'gilmar.meber@gmail.com',
      'gilmar.ribeiro@bmvagas.com.br'
    ];

    const results = [];

    for (const email of emails) {
      try {
        const user = await prisma.user.findUnique({ where: { email } });
        
        if (user) {
          // Deletar relacionamentos
          await prisma.professionalProfile.deleteMany({ where: { userId: user.id } }).catch(() => {});
          await prisma.event.deleteMany({ where: { clientId: user.id } }).catch(() => {});
          await prisma.proposal.deleteMany({ where: { professionalId: user.id } }).catch(() => {});
          await prisma.review.deleteMany({ where: { reviewerId: user.id } }).catch(() => {});
          await prisma.account.deleteMany({ where: { userId: user.id } }).catch(() => {});
          await prisma.session.deleteMany({ where: { userId: user.id } }).catch(() => {});
          
          // Deletar usuário
          await prisma.user.delete({ where: { id: user.id } });
          
          results.push({ email, status: 'deleted', id: user.id });
        } else {
          results.push({ email, status: 'not_found' });
        }
      } catch (error) {
        results.push({ email, status: 'error', error: (error as Error).message });
      }
    }

    return NextResponse.json({ 
      message: 'Processamento concluído',
      results 
    });

  } catch (error) {
    console.error('Erro ao deletar usuários:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}