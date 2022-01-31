import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextApiHandler } from 'next';
import { prisma } from '../../../../database/prisma';
import { IN_ATTENTION, IN_PROGRESS } from '../../../../constants/task-stages';
import { getUserAuthId } from '../../../../apiService/auth/helpers';
import { withSentry } from '@sentry/nextjs';

const auth0HookToken = process.env.AUTH0_HOOK_TOKEN || '';

const usersHandler: NextApiHandler = async (req, res) => {
  console.log(`${req.method} - ${req.url}`);

  switch (req.method) {
    case 'POST': {
      if (req.headers.authorization !== auth0HookToken) {
        res.status(401).json({ message: 'You are not authorized' });
        break;
      }

      const { email, name, auth_id } = req.body;

      try {
        await prisma.user.create({
          data: {
            email,
            name,
            auth_id,
          },
        });

        res.send('OK');
      } catch (err) {
        console.error(
          'POST /api/v2/users - Failed attempt to add user to database',
          err
        );
        res.status(500).end();
      }

      break;
    }
    case 'PUT': {
      const authId = getUserAuthId(req, res);
      if (!authId) {
        res.status(401).end();
        return;
      }

      await prisma.user.update({
        where: {
          id: req.body.id,
        },
        data: { ...req.body },
      });

      res.send('OK');

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
            id: true,
            name: true,
            createdAt: true,
            img_url: true,
            bio: true,
            skills: true,
            type: true,
            hasJoinedDiscord: true,
            anonId: true,
            stripeAccountId: true,
            stripeCustomerId: true,
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

export default withSentry(withApiAuthRequired(usersHandler));
