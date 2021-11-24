import { prisma } from './../../../database/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
//import { IN_ATTENTION } from 'src/constants/task-stages';

export default async function (
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
      const task = await prisma.task.findFirst({
        where: {
          id: 66,
        },
      });

      if (task !== null && task.userId !== null) {
        const user = await prisma.user.findFirst({
          where: { email: task.userId },
        });
        if (user !== null && user.name !== null) {
          res.json({ name: user.name });
        } else {
          res.json({ message: 'no user' });
        }
      } else {
        res.json({ message: 'no task' });
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

// potentia util for testing https://dev.to/jamesharv/comment/145f8
