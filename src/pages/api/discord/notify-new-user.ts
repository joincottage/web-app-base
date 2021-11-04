import { NextApiRequest, NextApiResponse } from 'next';
import Axios from 'axios';

interface NotifyNewUserRequest extends NextApiRequest {
  body: {
    name: string;
    email: string;
    skills: string;
  };
}
const discordWebhookBaseUrl = 'https://discord.com/api/webhooks';
const formatInfo = (
  name: string,
  email: string,
  skills: string
) => `Welcome new user!
Name: ${name}
Email: ${email}
Skills: ${skills}`;

export default async function (
  req: NotifyNewUserRequest,
  res: NextApiResponse
) {
  const { body, method } = req;
  const name = body.name;
  const email = body.email;
  const skills = body.skills;

  if (method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${method} Not Allowed`);

    return;
  }

  try {
    console.log(`Posting info to discord`);

    await Axios.post(
      `${discordWebhookBaseUrl}/${process.env.DISCORD_NOTIFY_NEW_USER_CHANNEL_ID}/${process.env.DISCORD_NOTIFY_NEW_USER_CHANNEL_TOKEN}`,
      {
        content: formatInfo(name, email, skills),
      }
    );

    console.log(`Successfully posted info to discord`);
    res.status(200).json({ message: 'success' });
  } catch (error) {
    console.error(`Failed posing info to discord`, error);
    res.status(500).json({ message: 'Failed to post info' });
  }
}
