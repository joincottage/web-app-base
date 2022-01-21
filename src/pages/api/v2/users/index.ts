import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextApiHandler } from 'next';
import { prisma } from '../../../../database/prisma';
import { IN_ATTENTION, IN_PROGRESS } from '../../../../constants/task-stages';
import { getUserAuthId } from '../../../../apiService/auth/helpers';
import { getUserAuthEmail } from 'src/apiService/auth/email';

const userHandler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case 'POST': {
      const userAuthId = getUserAuthId(req, res);
      const userEmail = getUserAuthEmail(req, res);
      if (userAuthId == null) {
        res.status(401).end();
        return;
      }
      try {
        const user = await prisma.user.findFirst({
          where: { auth_id: userAuthId },
        });

        if (user === null) {
          await prisma.user.create({
            data: {
              auth_id: userAuthId,
              email: userEmail,
            },
          });
        }
        res.send('OK');
      } catch (err) {
        console.error('Failed trying to fetch current task for user', err);
        res.status(500).end();
      }

      break;
    }
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
            name: true,
            createdAt: true,
            img_url: true,
            bio: true,
            skills: true,
            type: true,
            hasJoinedDiscord: true,
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
                client: {
                  select: {
                    id: true,
                    name: true,
                    logoUrl: true,
                  },
                },
              },
              where: {
                status: {
                  in: [IN_PROGRESS, IN_ATTENTION],
                },
              },
            },
          },
          where: {
            auth_id: authId,
          },
        });

        res.json(user);
      } catch (e) {
        console.error('Failed to execute prisma query for user ', e.message);

        res.status(500).end();
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

export default withApiAuthRequired(userHandler);
