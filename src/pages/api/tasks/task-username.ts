import { prisma } from '../../../database/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { withSentry } from '@sentry/nextjs';

async function taskUsernameHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  switch (req.method) {
    //Create
    case 'POST':
      console.error(
        `Unsupported method type ${req.method} made to endpoint ${req.url}`
      );
      res.status(404).end();
      break;

    case 'GET':
      try {
        const task = await prisma.task.findFirst({
          where: {
            id: 66,
          },
        });

        if (task !== null && task.userId !== null) {
          const user = await prisma.user.findFirst({
            where: { id: task.userId },
          });
          if (user !== null && user.name !== null) {
            res.json({ name: user.name });
          } else {
            res.json({ message: 'no user' });
          }
        } else {
          res.json({ message: 'no task' });
        }
      } catch (err) {
        console.error('failed trying to fetch the username for a task', err);

        // Throw error to Sentry
        throw err;
      }
      break;
    default: {
      console.error(
        `Unsupported method type ${req.method} made to endpoint ${req.url}`
      );
      res.status(404).end();
      break;
    }
  }
}

export default withSentry(taskUsernameHandler);

// potentia util for testing https://dev.to/jamesharv/comment/145f8
