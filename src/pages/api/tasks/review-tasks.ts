import { prisma } from './../../../database/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { IN_REVIEW } from 'src/constants/task-stages';
import { getUserAuthId } from 'src/apiService/auth/helpers';
import { withSentry } from '@sentry/nextjs';

async function reviewTasks(
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
      const userAuthId = getUserAuthId(req, res);
      if (userAuthId == null) {
        res.status(401).end();
        return;
      }

      try {
        const user = await prisma.user.findFirst({
          where: { auth_id: userAuthId },
        });

        if (user === null) {
          console.log('GET /api/review-tasks - User not found in cottage DB');
          res.status(500).end();
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

export default withSentry(reviewTasks);

// potential util for testing https://dev.to/jamesharv/comment/145f8
