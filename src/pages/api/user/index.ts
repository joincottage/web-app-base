import { prisma } from '../../../database/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      await prisma.user.create({
        data: {
          ...req.body,
        },
      });
      res.send('OK');
      break;
    // case 'PUT':
    //   await prisma.user.create({
    //     data: {
    //       ...req.body,
    //     },
    //   });
    //   res.send('OK');
    //   break;
    case 'GET':
      const users = await prisma.user.findMany();
      const cleansedUsers = users.map((user) => {
        return {
          bio: user.bio,
          name: user.name,
          imgUrl: user.img_url,
        };
      });
      res.json(cleansedUsers);
      break;
  }
}
