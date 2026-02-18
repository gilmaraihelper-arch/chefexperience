import nodemailer from 'nodemailer';

// Configuração do transporter (SendGrid, AWS SES, ou SMTP)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.sendgrid.net',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'apikey',
    pass: process.env.SMTP_PASSWORD,
  },
});

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export async function sendEmail(options: EmailOptions) {
  try {
    const result = await transporter.sendMail({
      from: options.from || 'ChefExperience <noreply@chefexperience.com.br>',
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    console.log('✅ Email enviado:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    return { success: false, error };
  }
}

// Templates de Email

export const emailTemplates = {
  // 1. Boas-vindas para novos usuários
  welcome: (data: { name: string; type: 'CLIENT' | 'PROFESSIONAL' }) => ({
    subject: 'Bem-vindo ao ChefExperience! 👋',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #F59E0B, #EA580C); padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0;">Bem-vindo ao ChefExperience! 🍽️</h1>
        </div>
        <div style="padding: 40px; background: white;">
          <p style="font-size: 18px; color: #333;">
            Olá <strong>${data.name}</strong>,
          </p>
          
          <p style="color: #666; line-height: 1.6;">
            ${data.type === 'CLIENT' 
              ? 'Estamos felizes em tê-lo conosco! Agora você pode encontrar os melhores profissionais de gastronomia para seus eventos especiais.'
              : 'Parabéns por fazer parte da nossa rede de profissionais! Estamos ansiosos para conectá-lo com clientes incríveis.'
            }
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://chefexperience.vercel.app/dashboard/${data.type.toLowerCase()}" 
               style="background: linear-gradient(135deg, #F59E0B, #EA580C); color: white; padding: 15px 30px; 
                      text-decoration: none; border-radius: 8px; display: inline-block;">
              Acessar Minha Conta
            </a>
          </div>
          
          <p style="color: #999; font-size: 14px;">
            Precisa de ajuda? Responda este email ou entre em contato pelo suporte.
          </p>
        </div>
      </div>
    `,
  }),

  // 2. Novo evento criado (notificar profissionais próximos)
  newEvent: (data: { 
    professionalName: string; 
    eventTitle: string; 
    eventType: string;
    guestCount: number;
    eventDate: string;
    eventId: string;
  }) => ({
    subject: '🎉 Novo evento próximo de você!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #10B981; padding: 30px; text-align: center;">
          <h2 style="color: white; margin: 0;">Novo Evento Disponível! 🎊</h2>
        </div>
        
        <div style="padding: 30px; background: white;">
          <p>Olá <strong>${data.professionalName}</strong>,</p>
          
          <p>Um novo evento foi criado próximo da sua região:</p>
          
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Tipo:</strong> ${data.eventType}</p>
            <p><strong>Título:</strong> ${data.eventTitle}</p>
            <p><strong>Convidados:</strong> ${data.guestCount} pessoas</p>
            <p><strong>Data:</strong> ${new Date(data.eventDate).toLocaleDateString('pt-BR')}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://chefexperience.vercel.app/evento/${data.eventId}/propostas" 
               style="background: #10B981; color: white; padding: 15px 30px; 
                      text-decoration: none; border-radius: 8px; display: inline-block;">
              Enviar Proposta
            </a>
          </div>
        </div>
      </div>
    `,
  }),

  // 3. Proposta recebida (notificar cliente)
  proposalReceived: (data: {
    clientName: string;
    professionalName: string;
    eventTitle: string;
    proposalValue: number;
    proposalId: string;
  }) => ({
    subject: '📨 Você recebeu uma proposta!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #F59E0B, #EA580C); padding: 30px; text-align: center;">
          <h2 style="color: white; margin: 0;">Nova Proposta Recebida! 📨</h2>
        </div>
        
        <div style="padding: 30px; background: white;">
          <p>Olá <strong>${data.clientName}</strong>,</p>
          
          <p>Você recebeu uma proposta de <strong>${data.professionalName}</strong> para o evento <strong>"${data.eventTitle}"</strong>.</p>
          
          <div style="background: #FEF3C7; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p style="font-size: 24px; color: #D97706; margin: 0;">
              R$ ${data.proposalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://chefexperience.vercel.app/proposta/${data.proposalId}" 
               style="background: linear-gradient(135deg, #F59E0B, #EA580C); color: white; padding: 15px 30px; 
                      text-decoration: none; border-radius: 8px; display: inline-block;">
              Ver Proposta Completa
            </a>
          </div>
        </div>
      </div>
    `,
  }),

  // 4. Proposta aceita (notificar profissional)
  proposalAccepted: (data: {
    professionalName: string;
    clientName: string;
    eventTitle: string;
    proposalValue: number;
    eventId: string;
  }) => ({
    subject: '🎉 Sua proposta foi aceita!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #10B981; padding: 30px; text-align: center;">
          <h2 style="color: white; margin: 0;">Proposta Aceita! 🎉</h2>
        </div>
        
        <div style="padding: 30px; background: white;">
          <p>Parabéns <strong>${data.professionalName}</strong>! 🎊</p>
          
          <p>Sua proposta para o evento <strong>"${data.eventTitle}"</strong> foi <strong>ACEITA</strong> por ${data.clientName}!</p>
          
          <div style="background: #D1FAE5; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p style="font-size: 20px; color: #059669; margin: 0;">
              Valor confirmado: R$ ${data.proposalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          
          <p>Entre em contato com o cliente para combinar os detalhes finais.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://chefexperience.vercel.app/evento/${data.eventId}" 
               style="background: #10B981; color: white; padding: 15px 30px; 
                      text-decoration: none; border-radius: 8px; display: inline-block;">
              Ver Evento
            </a>
          </div>
        </div>
      </div>
    `,
  }),

  // 5. Lembrete de evento (1 dia antes)
  eventReminder: (data: {
    name: string;
    eventTitle: string;
    eventDate: string;
    eventAddress: string;
    isProfessional: boolean;
  }) => ({
    subject: '⏰ Lembrete: Seu evento é amanhã!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #3B82F6; padding: 30px; text-align: center;">
          <h2 style="color: white; margin: 0;">Lembrete de Evento ⏰</h2>
        </div>
        
        <div style="padding: 30px; background: white;">
          <p>Olá <strong>${data.name}</strong>,</p>
          
          <p>${data.isProfessional 
            ? 'Você tem um evento agendado para amanhã:' 
            : 'Seu evento é amanhã! Não se esqueça:'
          }</p>
          
          <div style="background: #DBEAFE; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Evento:</strong> ${data.eventTitle}</p>
            <p><strong>Data:</strong> ${new Date(data.eventDate).toLocaleDateString('pt-BR')} às ${new Date(data.eventDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
            <p><strong>Local:</strong> ${data.eventAddress}</p>
          </div>
          
          <p style="color: #666;">
            ${data.isProfessional 
              ? 'Prepare-se para entregar o seu melhor! 🍽️' 
              : 'Aproveite seu evento! 🎉'
            }
          </p>
        </div>
      </div>
    `,
  }),

  // 6. Nova mensagem recebida
  newMessage: (data: {
    recipientName: string;
    senderName: string;
    eventTitle: string;
    messagePreview: string;
  }) => ({
    subject: '💬 Nova mensagem recebida',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #8B5CF6; padding: 30px; text-align: center;">
          <h2 style="color: white; margin: 0;">Nova Mensagem 💬</h2>
        </div>
        
        <div style="padding: 30px; background: white;">
          <p>Olá <strong>${data.recipientName}</strong>,</p>
          
          <p>Você recebeu uma nova mensagem de <strong>${data.senderName}</strong> sobre o evento "${data.eventTitle}":</p>
          
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8B5CF6;">
            <p style="margin: 0; color: #666; font-style: italic;">"${data.messagePreview.substring(0, 100)}${data.messagePreview.length > 100 ? '...' : ''}"</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://chefexperience.vercel.app/dashboard" 
               style="background: #8B5CF6; color: white; padding: 15px 30px; 
                      text-decoration: none; border-radius: 8px; display: inline-block;">
              Responder
            </a>
          </div>
        </div>
      </div>
    `,
  }),

  // 7. Conta desativada
  accountDeactivated: (data: { name: string }) => ({
    subject: '🔒 Sua conta foi temporariamente desativada',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #EF4444; padding: 30px; text-align: center;">
          <h2 style="color: white; margin: 0;">Conta Desativada 🔒</h2>
        </div>
        
        <div style="padding: 30px; background: white;">
          <p>Olá <strong>${data.name}</strong>,</p>
          
          <p>Sua conta no ChefExperience foi temporariamente desativada.</p>
          
          <p>Se você acredita que isso foi um erro ou deseja reativar sua conta, entre em contato com nosso suporte.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="mailto:suporte@chefexperience.com.br" 
               style="background: #EF4444; color: white; padding: 15px 30px; 
                      text-decoration: none; border-radius: 8px; display: inline-block;">
              Entrar em Contato
            </a>
          </div>
        </div>
      </div>
    `,
  }),

  // 8. Newsletter/Atualizações
  newsletter: (data: { name: string; content: string }) => ({
    subject: '📰 Novidades do ChefExperience',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #F59E0B, #EA580C); padding: 30px; text-align: center;">
          <h2 style="color: white; margin: 0;">Novidades do ChefExperience 📰</h2>
        </div>
        
        <div style="padding: 30px; background: white;">
          <p>Olá <strong>${data.name}</strong>,</p>
          
          <div style="line-height: 1.6; color: #333;">
            ${data.content}
          </div>
          
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;" />
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            Você está recebendo este email porque é usuário do ChefExperience.<br/>
            <a href="https://chefexperience.vercel.app/privacidade">Política de Privacidade</a>
          </p>
        </div>
      </div>
    `,
  }),
};

export default { sendEmail, emailTemplates };
