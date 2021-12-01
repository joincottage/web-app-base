//https://www.prisma.io/docs/concepts/components/prisma-client/crud
import { prisma } from './../../../database/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { postMessageToChannel } from 'src/apiService/discord/channel';
import { IN_PROGRESS, IN_REVIEW } from 'src/constants/task-stages';
import { getUserAuthId } from 'src/apiService/auth/helpers';

export default async function (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { body } = req;
  const name = body.name;
  const discordChannelId = body.discordChannelId;
  switch (req.method) {
    case 'POST': {
      // TODO: reenable before launch
      // if (req.headers.authorization !== auth0HookToken) {
      //   res.status(401).json({ message: 'You are not authorized' });
      //   break;
      // }
      await prisma.task.create({
        data: {
          ...req.body,
        },
      });

      res.send('OK');
      break;
    }
    //NOTE: Change current task to in_review
    case 'PUT': {
      try {
        await prisma.task.update({
          where: {
            id: req.body.task.id,
          },
          data: {
            status: IN_REVIEW,
          },
        });

        const reviewMessage = `${name} has submitted this task for review. Please take a look at the task as soon as you can.`;
        await postMessageToChannel(discordChannelId, reviewMessage);
        res.send('OK');
      } catch (err) {
        console.error('Failed trying to submit task to review', err);
        res.status(500).end();
      }
      break;
    }
    case 'GET':
      {
        const userInfo = getUserAuthId(req, res);
        console.log(userInfo);
        if (userInfo == null) {
          res.status(401).end();
          return;
        }

        try {
          const user = await prisma.user.findFirst({
            where: { auth_id: userInfo },
          });

          //FIXME: This needs to be moved to an onboarding flow.
          if (user === null) {
            await prisma.user.create({
              data: {
                auth_id: userInfo.sub,
                email: userInfo.email,
              },
            });
          }

          if (user !== null) {
            const tasks = await prisma.task.findMany({
              where: {
                userId: user.id,
                status: IN_PROGRESS,
              },
            });
            res.json(tasks);
          } else {
            res.json({ message: 'no task' });
          }
        } catch (err) {
          console.error('Failed trying to fetch current task for user', err);
          res.status(500).end();
        }
        break;
      }
      {
        /*
		case 'DELETE': {
			await prisma.task.deleteMany({
				where: {
					title: {
						contains: req.body.title,
					},
				},
			});
		}
		*/
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
