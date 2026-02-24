// Função para criar notificação de forma simples
import { prisma } from '@/lib/prisma'

export async function createNotification({
  userId,
  type,
  title,
  message,
  data,
  actionUrl
}: {
  userId: string
  type: string
  title: string
  message: string
  data?: any
  actionUrl?: string
}) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        data: data ? JSON.stringify(data) : null,
        actionUrl
      }
    })
    
    console.log('🔔 Notificação criada:', type, 'para usuário', userId)
    return notification
  } catch (error) {
    console.error('Erro ao criar notificação:', error)
    return null
  }
}