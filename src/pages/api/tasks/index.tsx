import { prisma } from '../../../database/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { TASK_QUEUED } from 'src/constants/task-stages';
import { getUserAuthId } from 'src/apiService/auth/helpers';
import { withSentry } from '@sentry/nextjs';

const auth0HookToken = process.env.AUTH0_HOOK_TOKEN || '';

async function tasksHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  switch (req.method) {
    case 'POST': {
      if (req.headers.authorization !== auth0HookToken) {
        res.status(401).json({ message: 'You are not authorized' });
        break;
      }
      try {
        await prisma.task.create({
          data: {
            ...req.body,
            discordChannelId: '',
            status: TASK_QUEUED,
          },
        });

        res.send('OK');
      } catch (err) {
        console.error('Failed trying to create a task', err);
        res.status(500).end();
      }
      break;
    }
    case 'PUT': {
      const userAuthId = getUserAuthId(req, res);
      try {
        const userClientId = await prisma.user.findUnique({
          where: {
            auth_id: userAuthId,
          },
          select: {
            clientId: true,
          },
        });

        const taskClientId = await prisma.task.findUnique({
          where: { id: req.body.params.id },
          select: {
            clientId: true,
          },
        });

        if (taskClientId?.clientId === userClientId?.clientId) {
          try {
            await prisma.task.update({
              where: {
                id: req.body.params.id,
              },
              data: {
                name: req.body.params.name,
                shortDesc: req.body.params.shortDesc,
                longDesc: req.body.params.longDesc,
                skills: req.body.params.skills,
                price: req.body.params.price,
              },
            });
            res.send('OK');
          } catch (err) {
            console.error(err);
            res.status(500).end();
          }
        } else {
          console.log('user does not belong to client who owns the task');
          res.status(403).end();
        }
      } catch (err) {
        console.error('Failed trying to update a task', err);
        res.status(500).end();
      }

      break;
    }
    case 'GET': {
      try {
        const tasks = await prisma.task.findMany();
        res.json(tasks);
      } catch (err) {
        console.error('Failed trying to fetch all tasks', err);

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

export default withSentry(tasksHandler);

// potential util for testing https://dev.to/jamesharv/comment/145f8
