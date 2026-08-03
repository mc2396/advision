import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.campaign.deleteMany();

  await prisma.campaign.createMany({
    data: [
      { name: 'Estate 2026', status: 'ACTIVE', budget: 500, spend: 210, ctr: 4.2 },
      { name: 'San Valentino', status: 'PAUSED', budget: 300, spend: 95, ctr: 2.8 },
      { name: 'Black Friday', status: 'ACTIVE', budget: 1000, spend: 420, ctr: 5.6 },
    ],
  });

  console.log('Seed completato.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
