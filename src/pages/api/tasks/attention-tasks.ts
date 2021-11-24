import { prisma } from './../../../database/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import { IN_ATTENTION } from 'src/constants/task-stages';

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
      const session = getSession(req, res);
      const userInfo = session?.user;
      if (userInfo == null) {
        res.status(401).end();
        return;
      }

      const user = await prisma.user.findFirst({
        where: { auth_id: userInfo.sub },
      });

      if (user === null) {
        await prisma.user.create({
          data: {
            auth_id: userInfo.sub,
            email: userInfo.email,
          },
        });
      }

      if (user !== null) {
        const tasks = await prisma.task.findMany({
          where: {
            userId: userInfo.email,
            status: IN_ATTENTION,
          },
        });
        res.json(tasks);
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
