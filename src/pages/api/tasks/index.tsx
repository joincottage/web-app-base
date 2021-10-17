import { prisma } from '../../../database/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { createTextChannel } from 'src/apiService/discord/channel';
import { Task } from '@prisma/client';

const auth0HookToken = process.env.AUTH0_HOOK_TOKEN || '';

export default async function (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  switch (req.method) {
    case 'POST': {
      // TODO: reenable before launch
      // if (req.headers.authorization !== auth0HookToken) {
      //   res.status(401).json({ message: 'You are not authorized' });
      //   break;
      // }
      const channel = await createTextChannel(
        (req.body as Task).name?.split(' ').join('-') || '',
        (req.body as Task)?.shortDesc || '',
        (req.body as any)?.clientCategoryId || ''
      );
      await prisma.task.create({
        data: {
          ...req.body,
          discordChannelId: channel.id
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
      const tasks = await prisma.task.findMany();
      res.json(tasks);
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
