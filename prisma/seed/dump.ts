import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);

const writeDataToFile = async (filePath: string, data: any) => {
  await writeFile(filePath, JSON.stringify(data, null, ' '));
};

const prisma = new PrismaClient();

async function main() {
  console.log('Dumping data to json files..');

  const users = await prisma.user.findMany();
  await writeDataToFile(`${__dirname}/data/users.json`, users);

  const tasks = await prisma.task.findMany();
  await writeDataToFile(`${__dirname}/data/tasks.json`, tasks);

  const clients = await prisma.client.findMany();
  await writeDataToFile(`${__dirname}/data/clients.json`, clients);

  console.log('Data dump finished.');
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
