import { prisma } from '../../../database/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

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
      await prisma.task.create({
        data: {
          ...req.body,
        },
      });
      res.send('OK');
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
