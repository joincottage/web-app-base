//https://www.prisma.io/docs/concepts/components/prisma-client/crud
import { prisma } from './../../../../database/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { IN_PROGRESS } from 'src/constants/task-stages';
import { getUserAuthId } from 'src/apiService/auth/helpers';
import { withSentry } from '@sentry/nextjs';

async function currentTaskHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  switch (req.method) {
    //NOTE: Change current task to in_review
    case 'GET': {
      const userAuthId = getUserAuthId(req, res);
      if (userAuthId == null) {
        res.status(401).end();
        return;
      }

      try {
        const currentTasks = await prisma.user.findUnique({
          select: {
            tasks: {
              select: {
                id: true,
                name: true,
                shortDesc: true,
                longDesc: true,
                skills: true,
                datePosted: true,
                status: true,
                price: true,
                client: {
                  select: {
                    id: true,
                    name: true,
                    logoUrl: true,
                  },
                },
              },
              where: {
                status: {
                  in: IN_PROGRESS,
                },
              },
            },
          },
          where: {
            auth_id: userAuthId,
          },
        });

        res.json(
          currentTasks !== null && currentTasks.tasks[0] !== undefined
            ? currentTasks.tasks[0]
            : []
        );
      } catch (err) {
        console.error('Failed trying to fetch current task for user', err);

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

export default withSentry(currentTaskHandler);

// potential util for testing https://dev.to/jamesharv/comment/145f8
