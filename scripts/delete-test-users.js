const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function deleteTestUsers() {
  const emails = [
    'gilmar.ribeiro@bmvagas.com.br',
    'gilmar.guasque@gmail.com.br'
  ];

  for (const email of emails) {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (user) {
        // Deletar contas relacionadas (OAuth)
        await prisma.account.deleteMany({
          where: { userId: user.id },
        });

        // Deletar sessões
        await prisma.nextauthSession.deleteMany({
          where: { userId: user.id },
        });

        // Deletar usuário
        await prisma.user.delete({
          where: { id: user.id },
        });

        console.log(`✅ Usuário deletado: ${email}`);
      } else {
        console.log(`⚠️ Usuário não encontrado: ${email}`);
      }
    } catch (error) {
      console.error(`❌ Erro ao deletar ${email}:`, error.message);
    }
  }
}

deleteTestUsers()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
