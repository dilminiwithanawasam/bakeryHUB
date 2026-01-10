import { PrismaClient, role_type } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const roles = [
    {
      role_name: role_type.ADMIN,
      description: 'Owner / System Administrator',
    },
    {
      role_name: role_type.MANAGER,
      description: 'Outlet Manager',
    },
    {
      role_name: role_type.FACTORY_DISTRIBUTOR,
      description: 'Factory Distributor',
    },
    {
      role_name: role_type.SALESPERSON,
      description: 'Salesperson',
    },
    {
      role_name: role_type.CUSTOMER,
      description: 'Customer',
    },
  ];

  console.log('🌱 Seeding roles...');

  for (const role of roles) {
    const existing = await prisma.roles.findUnique({
      where: { role_name: role.role_name },
    });

    if (!existing) {
      await prisma.roles.create({ data: role });
      console.log(`Created role: ${role.role_name}`);
    } else {
      console.log(`Role already exists: ${role.role_name}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });