//https://www.prisma.io/docs/concepts/components/prisma-client/crud
import { prisma } from './../../../../database/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { postMessageToChannel } from 'src/apiService/discord/channel';
import { IN_PROGRESS, IN_REVIEW } from 'src/constants/task-stages';
import { getUserAuthId } from 'src/apiService/auth/helpers';
import { getUserAuthEmail } from 'src/apiService/auth/email';

export default async function (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { body } = req;
  const name = body.name;
  const discordChannelId = body.discordChannelId;
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
        console.log(currentTasks);
        res.json(currentTasks);
      } catch (err) {
        console.error('Failed trying to fetch current task for user', err);
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
