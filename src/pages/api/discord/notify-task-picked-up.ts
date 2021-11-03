import { Task } from '.prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  addUserToChannel,
  postMessageToChannel,
} from 'src/apiService/discord/channel';
import { prisma } from 'src/database/prisma';

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
  const userEmail = body.userEmail;

  if (method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${method} Not Allowed`);

    return;
  }

  try {
    console.log(`Updating task in DB with Prisma`);
    await prisma.task.update({
      where: {
        id: task.id,
      },
      data: {
        status: 'in_progress',
      },
    });
    // await prisma.user.update({
    //   where: {
    //     email: userEmail,
    //   },
    //   data: {
    //     currentTaskId: task.id,
    //   },
    // });
    console.log('Task successfully updated in DB');
    await postMessageToChannel(discordChannelId, formatInfo(name));
    await addUserToChannel(discordChannelId, discordUserId);
    res.status(200).json({ message: 'success' });
  } catch (error) {
    console.error(`Failed posting info to discord`, error);
    res.status(500).json({ message: 'Failed to post info' });
  }
}
