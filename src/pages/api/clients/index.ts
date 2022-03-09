import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../database/prisma';
import { withSentry } from '@sentry/nextjs';

async function clientsHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  switch (req.method) {
    case 'POST': {
      if (req.headers.authorization !== process.env.API_ACCESS_TOKEN) {
        res.status(401).json({ message: 'You are not authorized' });
        break;
      }
      await prisma.client.create({
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
      const clients = await prisma.client.findMany();
      res.json(clients);
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

export default withSentry(clientsHandler);

// potential util for testing https://dev.to/jamesharv/comment/145f8
