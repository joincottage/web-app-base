import { createTextChannel } from '../../../apiService/discord/channel';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'POST': {
      try {
        const { name, topic } = req.body;
        if (!name) {
          res.status(400).json({
            message: 'Property "name" must be provided to create a channel',
          });
        }
        const channel = await createTextChannel(name, topic);

        res.json(channel);
      } catch (e) {
        console.error(
          `Failed to create channel for request: ${JSON.stringify(req.body)}`,
          e
        );
        res.status(500).end();
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

export default handler;
