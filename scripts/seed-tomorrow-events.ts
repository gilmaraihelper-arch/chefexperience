// Script desativado - erro de importação PrismaBetterSQLite3
// TODO: Corrigir importação se necessário

console.log('Script temporariamente desativado');

// Código original comentado:
/*
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSQLite3 } from '@prisma/adapter-better-sqlite3';
import Database from 'better-sqlite3';

const db = new Database('dev.db');
const adapter = new PrismaBetterSQLite3(db);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Criar usuário cliente
  const clientUser = await prisma.user.upsert({
    where: { email: 'cliente@teste.com' },
    update: {},
    create: {
      email: 'cliente@teste.com',
      name: 'Cliente Teste',
      phone: '(11) 99999-9999',
      userType: 'CLIENT',
      password: 'senha123',
    },
  });

  // Criar usuário profissional
  const professionalUser = await prisma.user.upsert({
    where: { email: 'profissional@teste.com' },
    update: {},
    create: {
      email: 'profissional@teste.com',
      name: 'Profissional Teste',
      phone: '(11) 98888-8888',
      userType: 'PROFESSIONAL',
      password: 'senha123',
    },
  });

  console.log('Seed concluído:', { clientUser, professionalUser });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
*/
