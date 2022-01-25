import { NextApiHandler } from 'next';
import { prisma } from '../../../../database/prisma';
import { withSentry } from '@sentry/nextjs';

const usersHandler: NextApiHandler = async (req, res) => {
  console.log(`${req.method} - ${req.url}`);

  switch (req.method) {
    /*
    Returns information about the currently authenticated user along with any tasks
    that are in progress
     */
    case 'GET': {
      const anonId: string = req.query.anonId as string;
      if (!anonId) {
        res.status(400).end();
        return;
      }

      try {
        const user = await prisma.user.findFirst({
          select: {
            id: true,
            name: true,
          },
          where: {
            anonId,
          },
        });

        res.json(user);
      } catch (e: any) {
        console.error('Failed to execute prisma query for user ', e.message);

        // Throw error to Sentry
        throw e;
      }

      break;
    }
    default: {
      console.error(
        `/api/v2/users called with invalid http method ${req.method}`
      );
      res.status(404).end();
    }
  }
};

export default withSentry(usersHandler);
