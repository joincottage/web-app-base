import { prisma } from './../../../../database/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getUserAuthId } from 'src/apiService/auth/helpers';
import { withSentry } from '@sentry/nextjs';

async function taskStatusHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const taskStatus = req.query.taskStatus;

  switch (req.method) {
    case 'GET': {
      const userAuthId = getUserAuthId(req, res);
      if (userAuthId == null) {
        res.status(401).end();
        return;
      }

      try {
        const tasks = await prisma.user.findUnique({
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
                  in: taskStatus,
                },
              },
            },
          },
          where: {
            auth_id: userAuthId,
          },
        });

        res.json(tasks !== null ? tasks : []);
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

export default withSentry(taskStatusHandler);

// potential util for testing https://dev.to/jamesharv/comment/145f8
