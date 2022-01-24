import { createTextChannel } from '../../../apiService/discord/channel';
import { NextApiRequest, NextApiResponse } from 'next';
import { withSentry } from '@sentry/nextjs';

const channelHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'POST': {
      try {
        const { name, topic, categoryId } = req.body;
        if (!name) {
          res.status(400).json({
            message: 'Property "name" must be provided to create a channel',
          });
        }
        const channel = await createTextChannel(name, topic, categoryId);

        res.json(channel);
      } catch (e) {
        console.error(
          `Failed to create channel for request: ${JSON.stringify(req.body)}`,
          e
        );

        // Throw error to Sentry
        throw e;
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
};

export default withSentry(channelHandler);
