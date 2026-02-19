import { prisma } from '../src/lib/prisma';

async function main() {
  const emails = [
    'gilmar.guasque@gmail.com',
    'gilmar.meber@gmail.com',
    'gilmar.ribeiro@bmvagas.com.br'
  ];

  console.log('🔍 Buscando usuários...\n');
  
  for (const email of emails) {
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (user) {
      console.log(`✅ ENCONTRADO: ${email}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Type: ${user.type || 'NULL'}`);
      console.log(`   Name: ${user.name || 'NULL'}`);
      console.log(`   isActive: ${user.isActive}`);
      console.log(`   Created: ${user.createdAt}\n`);
    } else {
      console.log(`❌ NÃO ENCONTRADO: ${email}\n`);
    }
  }
  
  // Buscar todos os usuários que começam com gilmar
  console.log('🔍 Buscando todos os usuários gilmar*...\n');
  const allUsers = await prisma.user.findMany({
    where: {
      email: {
        startsWith: 'gilmar'
      }
    }
  });
  
  console.log(`Total: ${allUsers.length} usuários`);
  allUsers.forEach(u => {
    console.log(`- ${u.email} | type: ${u.type || 'NULL'} | name: ${u.name || 'NULL'}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
