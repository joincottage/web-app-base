/**
 * This module generates a one-time use invite to a server.
 * Currently using discord.js v12 as v13 requires NodeJS 16+
 * which is not yet supported on Vercel
 *
 * v12 docs: https://discord.js.org/#/docs/main/v12/general/welcome
 */
import { NextApiRequest, NextApiResponse } from 'next';
import { createInviteLink } from '../../../apiService/discord/invite';
import { withSentry } from '@sentry/nextjs';

const inviteHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET': {
      try {
        const inviteLink = await createInviteLink();
        res.redirect(inviteLink);
      } catch (e) {
        console.error(`Failed to get discord invite link`, e);

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

export default withSentry(inviteHandler);
