import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextApiHandler } from 'next';
import { prisma } from '../../../../database/prisma';
import { getUserAuthId } from '../../../../apiService/auth/helpers';

const taskHandler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    // case 'POST': {
    //   await prisma.user.create({
    //     data: {
    //       ...req.body,
    //     },
    //   });
    //   res.send('OK');
    //   break;
    // }
    /*

     */
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
      } catch (e) {
        console.error(
          `Failed to execute prisma query for tasks with inputs status: ${status}, client: ${client}, user: ${user}`,
          e.message
        );
        res.status(500).end();
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

export default withApiAuthRequired(taskHandler);
