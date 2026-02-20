import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { UserType, PersonType } from '@prisma/client'
import { checkRateLimit, getClientIP } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { error: 'Muitas tentativas. Tente novamente em 15 minutos.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const {
      email,
      password,
      name,
      phone,
      whatsapp,
      type,
      personType,
      cpf,
      cnpj,
      cep,
      address,
      number,
      complement,
      neighborhood,
      city,
      state,
    } = body

    // Validar campos obrigatórios
    if (!email || !password || !name || !type || !personType) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      )
    }

    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 409 }
      )
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 12)

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        whatsapp,
        type: type as UserType,
        personType: personType as PersonType,
        cpf,
        cnpj,
        cep: cep || '',
        address: address || '',
        number: number || '',
        complement,
        neighborhood: neighborhood || '',
        city: city || '',
        state: state || '',
      },
    })

    // Criar perfil correspondente
    if (type === 'CLIENT') {
      await prisma.clientProfile.create({
        data: {
          userId: user.id,
        },
      })
    } else if (type === 'PROFESSIONAL') {
      await prisma.professionalProfile.create({
        data: {
          userId: user.id,
          description: '',
          eventTypes: '[]',
          cuisineStyles: '[]',
          serviceTypes: '[]',
          priceRanges: '[]',
          capacity: '[]',
        },
      })
    }

    // Enviar email de boas-vindas
    try {
      const { sendEmail, emailTemplates } = await import('@/lib/email');
      
      const template = emailTemplates.welcome({
        name: user.name,
        type: user.type as 'CLIENT' | 'PROFESSIONAL'
      });
      
      await sendEmail({
        to: user.email,
        subject: template.subject,
        html: template.html
      });
      
      console.log('📧 Email de boas-vindas enviado para:', user.email);
    } catch (emailError) {
      console.error('Erro ao enviar email de boas-vindas:', emailError);
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        type: user.type,
      }
    })
  } catch (error) {
    console.error('Erro no registro:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}