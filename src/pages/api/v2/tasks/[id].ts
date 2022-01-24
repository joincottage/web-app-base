import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextApiHandler } from 'next';
import { prisma } from '../../../../database/prisma';
import { getUserAuthId } from '../../../../apiService/auth/helpers';
import { withSentry } from '@sentry/nextjs';

const taskHandler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case 'GET': {
      const authId = getUserAuthId(req, res);
      if (!authId) {
        res.status(401).end();

        return;
      }

      const taskId = req.query.id;
      if (!taskId) {
        res.status(400).send('invalid task id');
      }

      try {
        const task = await prisma.task.findUnique({
          select: {
            name: true,
            status: true,
            datePosted: true,
            skills: true,
            shortDesc: true,
            longDesc: true,
            price: true,
            discordChannelId: true,
            client: {
              select: {
                id: true,
                name: true,
                logoUrl: true,
              },
            },
          },
          where: {
            id: Number(taskId),
          },
        });

        res.json(task);
      } catch (e: any) {
        console.error(
          `Failed to execute prisma query for task with id: ${taskId}`,
          e.message
        );

        // Throw error to Sentry
        throw e;
      }

      break;
    }
    default: {
      console.error(
        `/api/v2/tasks/[:id] called with invalid http method ${req.method}`
      );
      res.status(404).end();
    }
  }
};

export default withSentry(withApiAuthRequired(taskHandler));
