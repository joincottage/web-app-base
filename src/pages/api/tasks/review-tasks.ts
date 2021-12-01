import { prisma } from './../../../database/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { IN_REVIEW } from 'src/constants/task-stages';
import { getUserAuthId } from 'src/apiService/auth/helpers';

//const auth0HookToken = process.env.AUTH0_HOOK_TOKEN || '';

export default async function (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  switch (req.method) {
    case 'POST':
      console.error(
        `Unsupported method type ${req.method} made to endpoint ${req.url}`
      );
      res.status(404).end();
      break;
    case 'GET': {
      const userInfo = getUserAuthId(req, res);
      if (userInfo == null) {
        res.status(401).end();
        return;
      }

      try {
        const user = await prisma.user.findFirst({
          where: { auth_id: userInfo },
        });

        //FIXME: This needs to be moved to an onboarding flow.
        if (user === null) {
          await prisma.user.create({
            data: {
              auth_id: userInfo,
              email: userInfo.email,
            },
          });
        }

        if (user !== null) {
          const tasks = await prisma.task.findMany({
            where: {
              userId: user.id,
              status: IN_REVIEW,
            },
          });
          res.json(tasks);
        } else {
          res.json({ message: 'no task' });
        }
      } catch (err) {
        console.error('Failed trying to fetch tasks in review for user', err);
        res.status(500).end();
      }
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
