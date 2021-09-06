import { prisma } from '../../../database/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { encrypt } from '../../../utils/encryption';

const auth0HookToken = process.env.AUTH0_HOOK_TOKEN || '';

export default async function (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  switch (req.method) {
    case 'POST': {
      if (req.headers.authorization !== auth0HookToken) {
        res.status(401).json({ message: 'You are not authorized' });
        break;
      }
      await prisma.user.create({
        data: {
          ...req.body,
        },
      });
      res.send('OK');
      break;
    }
    // case 'PUT':
    //   await prisma.user.create({
    //     data: {
    //       ...req.body,
    //     },
    //   });
    //   res.send('OK');
    //   break;
    case 'GET': {
      const users = await prisma.user.findMany();
      const cleansedUsers = users.map((user) => {
        return {
          bio: user.bio,
          name: user.name,
          imgUrl: user.img_url,
          id: encrypt(user.email), // give em the old swap-a-roo
        };
      });
      res.json(cleansedUsers);
      break;
    }
    default: {
      console.error(
        `Unsupported method type ${req.method} made to endpoint ${req.url}`
      );
      res.status(404).end();
      break;
    }
  }
}

// potential util for testing https://dev.to/jamesharv/comment/145f8
