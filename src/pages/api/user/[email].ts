import { prisma } from '../../../database/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  const userId = Number(id);
  if (isNaN(userId)) {
    console.error(`Attempt was made to get user for invalid User ID ${id}`);
    res.status(404).end();

    return;
  }

  switch (req.method) {
    case 'GET':
      const users = await prisma.user.findUnique({
        where: { email },
      });
      res.json(users);
      break;
  }
}
