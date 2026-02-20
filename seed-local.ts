import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {},
    create: {
      email: 'admin@admin.com',
      name: 'Admin',
      password: hashedPassword,
      type: 'ADMIN'
    }
  });
  console.log('Admin created:', admin.email);
  
  // Create test professional
  const chefPassword = await bcrypt.hash('chef123', 10);
  const chef = await prisma.user.upsert({
    where: { email: 'chef@chef.com' },
    update: {},
    create: {
      email: 'chef@chef.com',
      name: 'Chef Teste',
      password: chefPassword,
      type: 'PROFESSIONAL'
    }
  });
  console.log('Chef created:', chef.email);
  
  // Create test client
  const clientPassword = await bcrypt.hash('cliente123', 10);
  const client = await prisma.user.upsert({
    where: { email: 'cliente@cliente.com' },
    update: {},
    create: {
      email: 'cliente@cliente.com',
      name: 'Cliente Teste',
      password: clientPassword,
      type: 'CLIENT'
    }
  });
  console.log('Client created:', client.email);
  
  console.log('\n✅ Database seeded successfully!');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
