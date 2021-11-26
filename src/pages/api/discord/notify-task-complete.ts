import { Task } from '.prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  addUserToChannel,
  postMessageToChannel,
} from 'src/apiService/discord/channel';
import { prisma } from 'src/database/prisma';
import { getSession } from '@auth0/nextjs-auth0';
import { DONE, IN_PROGRESS } from 'src/constants/task-stages';

interface NotifyTaskCompleteRequest extends NextApiRequest {
  body: {
    discordChannelId: string;
    task: Task;
  };
}
const formatInfo = () =>
  `Congratulations! This task has been accepted as complete.`;

export default async function (
  req: NotifyTaskCompleteRequest,
  res: NextApiResponse
) {
  const { body, method } = req;
  const discordChannelId = body.discordChannelId;
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

    await prisma.task.update({
      where: {
        id: task.id,
      },
      data: {
        status: DONE,
      },
    });
    console.log('Task successfully updated in DB');
    await postMessageToChannel(discordChannelId, formatInfo());
    res.status(200).json({ message: 'success' });
  } catch (error) {
    console.error(`Failed posting info to discord`, error);
    res.status(500).json({ message: 'Failed to post info' });
  }
}
