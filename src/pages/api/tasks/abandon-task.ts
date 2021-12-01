//https://www.prisma.io/docs/concepts/components/prisma-client/crud
import { prisma } from './../../../database/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { removeUserFromChannel } from 'src/apiService/discord/channel';
import { TASK_QUEUED } from 'src/constants/task-stages';

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

export default async function (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { body } = req;
  const discordChannelId = body.discordChannelId;
  const discordUserId = body.discordUserId;

  switch (req.method) {
    case 'POST': {
    }
    //MARK: Change current task to in_review
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
        res.status(500).end();
      }

      res.send('OK');
      break;
    case 'GET': {
    }
    case 'DELETE': {
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
