import { Task } from '.prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  addUserToChannel,
  postMessageToChannel,
} from 'src/apiService/discord/channel';
import { prisma } from 'src/database/prisma';
import { getSession } from '@auth0/nextjs-auth0';
import { IN_PROGRESS } from 'src/constants/task-stages';
import { getUserAuthId } from 'src/apiService/auth/helpers';

interface NotifyTaskInterestRequest extends NextApiRequest {
  body: {
    name: string;
    discordChannelId: string;
    discordUserId: string;
    task: Task;
    userEmail: string;
  };
}
const formatInfo = (name: string) =>
  `A freelancer has picked up your task! Please welcome ${name} to the channel. ${name}, please request any additional details you need to commence work on this task.`;

export default async function (
  req: NotifyTaskInterestRequest,
  res: NextApiResponse
) {
  const { body, method } = req;
  const name = body.name;
  const discordChannelId = body.discordChannelId;
  const discordUserId = body.discordUserId;
  const task = body.task;

  if (method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${method} Not Allowed`);

    return;
  }

  try {
    console.log(`Updating task in DB with Prisma`);
    const session = getSession(req, res);
    const userInfo = session?.user;
    if (userInfo == null) {
      res.status(401).end();
      return;
    }

    const userAuthId = getUserAuthId(req, res);
    const user = await prisma.user.findUnique({
      where: {
        auth_id: userAuthId,
      },
      select: {
        id: true,
      },
    });
    if (user == null) {
      res.status(500).end();
      return;
    }

    try {
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
        await postMessageToChannel(discordChannelId, formatInfo(name));
        await addUserToChannel(discordChannelId, discordUserId);
        res.status(200).json({ message: 'success' });
      }
    } catch (err) {
      console.error(`Failed to update task`, err);
      res
        .status(500)
        .json({ message: 'Error picking up task: Task Unavailable' });
    }
  } catch (error) {
    console.error(`Failed posting info to discord`, error);
    res.status(500).json({ message: 'Failed to post info' });
  }
}
