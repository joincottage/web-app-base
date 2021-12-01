import { prisma } from '../../../database/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { createTextChannel } from 'src/apiService/discord/channel';
import { Task } from '@prisma/client';
import { TASK_QUEUED } from 'src/constants/task-stages';
import { getUserAuthId } from 'src/apiService/auth/helpers';

const auth0HookToken = process.env.AUTH0_HOOK_TOKEN || '';

export default async function (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  switch (req.method) {
    case 'POST': {
      // TODO: reenable before launch
      // if (req.headers.authorization !== auth0HookToken) {
      //   res.status(401).json({ message: 'You are not authorized' });
      //   break;
      // }
      try {
        const channel = await createTextChannel(
          (req.body as Task).name?.split(' ').join('-') || '',
          (req.body as Task)?.shortDesc || '',
          (req.body as any)?.clientCategoryId || ''
        );
        await prisma.task.create({
          data: {
            ...req.body,
            discordChannelId: channel.id,
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
      const userInfo = getUserAuthId(req, res);
      console.log('heloo', userInfo);
      try {
        const test = await prisma.task.findMany({
          where: {
            id: req.body.params.id,
          },
          include: {
            client: {
              include: {
                users: {
                  where: { auth_id: userInfo },
                },
              },
            },
          },
        });
        console.log('test', test);

        /*
								{
									where: { auth_id: userInfo },
								},
								*/
        /*
				await prisma.task.update({
					where: {
						id: req.body.params.id,
					},
					include: {
						client: {
							include: {
								users: {
									where: { auth_id: userInfo },
								},
							},
						},
					},
					data: {
						name: req.body.params.name,
						shortDesc: req.body.params.shortDesc,
						longDesc: req.body.params.longDesc,
						skills: req.body.params.skills,
						price: req.body.params.price,
					},
				});
				*/
        res.send('OK');
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
