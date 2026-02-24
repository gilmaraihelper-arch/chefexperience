// Script para criar evento de teste
import { prisma } from '../src/lib/prisma.js';

async function main() {
  // Buscar usuário admin
  const user = await prisma.user.findUnique({
    where: { email: 'gilmar.aihelper@gmail.com' }
  });

  if (!user) {
    console.log('Usuário não encontrado');
    return;
  }

  // Buscar ou criar perfil de cliente
  let clientProfile = await prisma.clientProfile.findUnique({
    where: { userId: user.id }
  });

  if (!clientProfile) {
    clientProfile = await prisma.clientProfile.create({
      data: {
        userId: user.id,
        totalEvents: 0,
        totalSpent: 0,
        rating: 0
      }
    });
    console.log('Perfil de cliente criado');
  }

  // Criar evento de teste
  const event = await prisma.event.create({
    data: {
      clientId: clientProfile.id,
      name: 'Evento Teste Cancelamento',
      eventType: 'ANIVERSARIO',
      date: new Date('2026-12-25'),
      startTime: '19:00',
      duration: '4',
      billingType: 'PF',
      locationType: 'CLIENT_ADDRESS',
      address: 'Rua Teste, 123 - Curitiba',
      city: 'Curitiba',
      state: 'PR',
      hasKitchen: false,
      guestCount: 50,
      searchRadiusKm: 50,
      cuisineStyles: '["Brasileira"]',
      serviceTypes: '[]',
      needsWaiter: false,
      needsSoftDrinks: false,
      needsAlcoholicDrinks: false,
      needsDecoration: false,
      needsSoundLight: false,
      needsPhotographer: false,
      needsBartender: false,
      needsSweets: false,
      needsCake: false,
      needsPlatesCutlery: false,
      priceRange: 'MEDIUM',
      referenceImages: '[]',
      status: 'OPEN'
    }
  });

  console.log('Evento criado:', event.id);
  console.log('Nome:', event.name);
  console.log('Status:', event.status);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
