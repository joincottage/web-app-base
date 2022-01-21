import { Task } from '.prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  addUserToChannel,
  postMessageToChannel,
} from 'src/apiService/discord/channel';
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
  switch (req.method) {
    case 'POST': {
      try {
        //Kick user if they are not logged in.
        const userAuthId = getUserAuthId(req, res);
        if (userAuthId == null) {
          res.status(401).end();
          return;
        }

        await postMessageToChannel(discordChannelId, formatInfo(name));
        await addUserToChannel(discordChannelId, discordUserId);
        res.status(200).json({ message: 'success' });
      } catch (error) {
        console.error(`Failed posting info to discord`, error);
        res.status(500).json({ message: 'Failed to post info' });
      }

      break;
    }
    default: {
      console.error(
        `Unsupported method type ${method} made to endpoint ${req.url}`
      );
      res.status(404).end();
      break;
    }
  }
}
