//https://www.prisma.io/docs/concepts/components/prisma-client/crud
import { prisma } from './../../../database/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { removeUserFromChannel } from 'src/apiService/discord/channel';
import { TASK_QUEUED } from 'src/constants/task-stages';
import { withSentry } from '@sentry/nextjs';

//const auth0HookToken = process.env.AUTH0_HOOK_TOKEN || '';

{
  /*
export default withApiAuthRequired(async function products(req, res) {
	try {
		const { accessToken } = await getAccessToken(req, res);
		//const client = new BillingApiClient(accessToken);
		//return client.getBillingInfo();
		console.log("hello")
	} catch (error) {
		console.error(error);
		res.status(error.status || 500).end(error.message);
	}
});
*/
}

async function abandonTaskHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { body } = req;
  const discordChannelId = body.discordChannelId;
  const discordUserId = body.discordUserId;

  switch (req.method) {
    case 'PUT':
      try {
        await prisma.task.update({
          where: {
            id: req.body.task.id,
          },
          data: {
            status: TASK_QUEUED,
            userId: null,
          },
        });
        await removeUserFromChannel(discordChannelId, discordUserId);
      } catch (err) {
        console.error('Failed attempting to abandon task', err);

        // Throw error to Sentry
        throw err;
      }

      res.send('OK');
      break;
    default: {
      console.error(
        `Unsupported method type ${req.method} made to endpoint ${req.url}`
      );
      res.status(404).end();
      break;
    }
  }
}

export default withSentry(abandonTaskHandler);

// potential util for testing https://dev.to/jamesharv/comment/145f8
