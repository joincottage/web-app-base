import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextApiHandler } from 'next';
import { IN_PROGRESS } from 'src/constants/task-stages';
import { getUserAuthId } from '../../../../apiService/auth/helpers';
import { prisma } from '../../../../database/prisma';
import { withSentry } from '@sentry/nextjs';

const tasksHandler: NextApiHandler = async (req, res) => {
  const { body, method } = req;
  const task = body.task;
  switch (method) {
    case 'POST': {
      try {
        const session = getSession(req, res);
        const userInfo = session?.user;
        if (userInfo == null) {
          console.error(`User is not logged in.`);
          res.status(401).end();
          return;
        }

        const user = await prisma.user.findUnique({
          where: {
            auth_id: userInfo.sub,
          },
          select: {
            id: true,
          },
        });
        if (user == null) {
          console.error(`Failed to find cottage user`);
          res.status(401).end();
          return;
        }

        const updatedTask = await prisma.task.updateMany({
          where: {
            AND: [
              {
                id: task.id,
              },
              {
                userId: null,
              },
            ],
          },
          data: {
            status: IN_PROGRESS,
            userId: user.id,
            userImgUrl: userInfo.picture,
          },
        });
        if (updatedTask.count === 0) {
          console.error(`Failed updating task due to it being unavailible`);
          res
            .status(500)
            .json({ message: 'Error picking up task: Task Unavailable' });
        } else {
          console.log('Task successfully updated in DB');
          res.status(200).json({ message: 'Task Picked Up' });
        }
      } catch (err) {
        console.error(`Failed to update task`, err);
        res
          .status(500)
          .json({ message: 'Cannot find unique cottage user or task.' });
      }

      break;
    }
    case 'GET': {
      const authId = getUserAuthId(req, res);
      const { status, client, user } = req.query;

      if (!authId) {
        res.status(401).end();

        return;
      }

      if (Array.isArray(client)) {
        console.error('Attempting to query tasks for more than one client');
        res.status(400).send('Request can only contain one client');

        return;
      }

      if (!client && !user) {
        console.error('Attempting to query tasks without user or client');
        res.status(400).send('Request must include either client or user');

        return;
      }

      const statuses =
        typeof status === 'string' ? status.split(',') : undefined;
      const clientId = client ? Number(client) : undefined;
      const userId = user ? Number(user) : undefined;
      try {
        const tasks = await prisma.task.findMany({
          select: {
            id: true,
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
            datePosted: {
              not: null,
            },
            status: {
              in: statuses,
            },
            clientId,
            userId,
          },
        });

        res.json(tasks);
      } catch (e: any) {
        console.error(
          `Failed to execute prisma query for tasks with inputs status: ${status}, client: ${client}, user: ${user}`,
          e.message
        );

        // Throw error to Sentry
        throw e;
      }

      break;
    }
    default: {
      console.error(
        `/api/v2/tasks called with invalid http method ${req.method}`
      );
      res.status(404).end();
    }
  }
};

export default withSentry(withApiAuthRequired(tasksHandler));
