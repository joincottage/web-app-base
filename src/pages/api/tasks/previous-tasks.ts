import { prisma } from './../../../database/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getUserAuthId } from 'src/apiService/auth/helpers';
import { getUserAuthEmail } from 'src/apiService/auth/email';
import { withSentry } from '@sentry/nextjs';

async function previousTasksHandler(
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

    case 'GET': {
      const userAuthId = getUserAuthId(req, res);
      const userEmail = getUserAuthEmail(req, res);
      if (userAuthId == null) {
        res.status(401).end();
        return;
      }

      try {
        const user = await prisma.user.findFirst({
          where: { auth_id: userAuthId },
        });

        if (user === null) {
          await prisma.user.create({
            data: {
              auth_id: userAuthId,
              email: userEmail,
            },
          });
        }

        //FIXME: This needs to be moved to an onboarding flow.
        if (user !== null) {
          const tasks = await prisma.task.findMany({
            where: {
              userId: user.id,
              status: 'approved',
            },
          });
          res.json(tasks);
        } else {
          res.json({ message: 'no task' });
        }
      } catch (err) {
        console.error('Failed trying to fetch completed tasks for user', err);

        // Throw error to Sentry
        throw err;
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

export default withSentry(previousTasksHandler);

// potentia util for testing https://dev.to/jamesharv/comment/145f8
