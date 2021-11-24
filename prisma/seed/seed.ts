import { PrismaClient } from '@prisma/client';
import users from './data/users.json';
import clients from './data/clients.json';
import tasks from './data/tasks.json';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding..');

  await prisma.user.createMany({ data: users });
  await prisma.client.createMany({ data: clients });
  await prisma.task.createMany({ data: tasks });

  console.log('Finished seeding the database.');
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
