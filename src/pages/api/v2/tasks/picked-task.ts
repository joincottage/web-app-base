//https://www.prisma.io/docs/concepts/components/prisma-client/crud
import { prisma } from './../../../../database/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import { IN_PROGRESS } from 'src/constants/task-stages';
import axios from 'axios';

export default async function (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { body, method } = req;
  const task = body.task;
  switch (req.method) {
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
          console.error(`Failed updating task due to it being unavalible`);
          res
            .status(500)
            .json({ message: 'Error picking up task: Task Unavailable' });
        } else {
          console.log('Task successfully updated in DB');
          //FIXME: This api call is failing
          await axios
            .post('api/discord/notify-task-picked-up', {})
            .then(function (response) {
              console.log(response);
              res.status(200).json({ message: 'success' });
            });
        }
      } catch (err) {
        console.error(`Failed to update task`, err);
        res
          .status(500)
          .json({ message: 'Error picking up task: Task Unavailable' });
      }
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
