import { prisma } from './../../../database/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { IN_ATTENTION } from 'src/constants/task-stages';
import { getUserAuthId } from 'src/apiService/auth/helpers';
import { getUserAuthEmail } from 'src/apiService/auth/email';
import { withSentry } from '@sentry/nextjs';

async function attentionTasks(
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

        //FIXME: This needs to be moved to an onboarding flow.
        if (user === null) {
          await prisma.user.create({
            data: {
              auth_id: userAuthId,
              email: userEmail,
            },
          });
        }

        if (user !== null) {
          const tasks = await prisma.task.findMany({
            where: {
              userId: user.id,
              status: IN_ATTENTION,
            },
          });
          res.json(tasks);
        } else {
          res.json({ message: 'no task' });
        }
      } catch (err) {
        console.error(
          'Failed trying to fetch tasks in attention for user',
          err
        );

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

export default withSentry(attentionTasks);

// potentia util for testing https://dev.to/jamesharv/comment/145f8
