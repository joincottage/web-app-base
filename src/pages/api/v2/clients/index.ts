import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextApiHandler } from 'next';
import { prisma } from '../../../../database/prisma';
import {
  DONE,
  IN_ATTENTION,
  IN_PROGRESS,
  IN_REVIEW,
  TASK_QUEUED,
} from '../../../../constants/task-stages';
import { getUserAuthId } from '../../../../apiService/auth/helpers';
import { withSentry } from '@sentry/nextjs';

const clientsHandler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    /*
    Returns information about the currently authenticated user along with any tasks
    that are in progress
     */
    case 'GET': {
      const authId = getUserAuthId(req, res);

      if (!authId) {
        res.status(401).end();

        return;
      }

      try {
        const user = await prisma.user.findUnique({
          select: {
            client: {
              select: {
                id: true,
                name: true,
                logoUrl: true,
                userEmailOfOwner: true,
                discordCategoryId: true,
                tasks: {
                  select: {
                    id: true,
                    name: true,
                    shortDesc: true,
                    longDesc: true,
                    skills: true,
                    datePosted: true,
                    status: true,
                    price: true,
                    type: true,
                    freelancer: true,
                    userId: true,
                    userImgUrl: true,
                    discordChannelId: true,
                  },
                  where: {
                    status: {
                      in: [
                        TASK_QUEUED,
                        IN_PROGRESS,
                        IN_ATTENTION,
                        IN_REVIEW,
                        DONE,
                      ],
                    },
                  },
                },
              },
            },
          },
          where: {
            auth_id: authId,
          },
        });

        res.json(user);
      } catch (e: any) {
        console.error('Failed to execute prisma query for user ', e.message);

        // Throw error to Sentry
        throw e;
      }

      return;
    }
    default: {
      console.error(
        `/api/v2/clients called with invalid http method ${req.method}`
      );
      res.status(404).end();
    }
  }
};

export default withSentry(withApiAuthRequired(clientsHandler));
