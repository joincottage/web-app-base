import { NextApiRequest, NextApiResponse } from 'next';
import Axios from 'axios';
import { withSentry } from '@sentry/nextjs';

interface NotifyNewUserRequest extends NextApiRequest {
  body: {
    name: string;
    userId: string;
    anonId: string;
    sessionId: string;
  };
}
const discordWebhookBaseUrl = 'https://discord.com/api/webhooks';
const formatInfo = (
  name: string,
  userId: string,
  anonId: string,
  sessionId: string
) => `New session started.
Name: ${name},
Cottage ID: ${userId},
AnonId: ${anonId}
SessionId: ${sessionId}`;

async function notifyNewUserHandler(
  req: NotifyNewUserRequest,
  res: NextApiResponse
) {
  const { body, method } = req;
  const name = body.name;
  const userId = body.userId;
  const anonId = body.anonId;
  const sessionId = body.sessionId;

  if (method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${method} Not Allowed`);

    return;
  }

  try {
    console.log(`Posting session info to discord`);

    await Axios.post(
      `${discordWebhookBaseUrl}/${process.env.DISCORD_NOTIFY_NEW_SESSION_CHANNEL_ID}/${process.env.DISCORD_NOTIFY_NEW_SESSION_CHANNEL_TOKEN}`,
      {
        content: formatInfo(name, userId, anonId, sessionId),
      }
    );

    console.log(`Successfully posted session info to discord`);
    res.status(200).json({ message: 'success' });
  } catch (error) {
    console.error(`Failed posting session info to discord`, error);

    // Throw error to Sentry
    throw error;
  }
}

export default withSentry(notifyNewUserHandler);
