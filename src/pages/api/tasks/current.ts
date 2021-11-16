//https://www.prisma.io/docs/concepts/components/prisma-client/crud
import { prisma } from './../../../database/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { Task, User } from '@prisma/client';
import Axios from 'axios';

//const auth0HookToken = process.env.AUTH0_HOOK_TOKEN || '';

export default async function (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  switch (req.method) {
    //Create
    case 'POST':
      {
        // TODO: reenable before launch
        // if (req.headers.authorization !== auth0HookToken) {
        //   res.status(401).json({ message: 'You are not authorized' });
        //   break;
        // }
        await prisma.task.create({
          data: {
            ...req.body,
          },
        });

        res.send('OK');
        break;
      }
      {
        /*
		case 'PUT':
			console.log('update task');
			await prisma.task.update({
				where: {
					id: req.body.task.id,
				},
				data: {
					status: 'in_review',
				},
			});

			//await prisma.user.update({
			//where: {
			//email: 'contact@brentonbeltrami.com',
			//},
			//data: {
			//currentTaskId: null,
			//},
			//});

			//TODO: Get current user
			//TODO: Update current taskid for logged in user
			let protocol = 'https://';
			if (req.headers.host?.indexOf('localhost') !== -1) {
				protocol = 'http://';
			}
			console.log('get auth');
			const response = await Axios.get(
				protocol + req.headers.host + '/api/auth/me',
				{
					headers: req.headers,
				}
			);
			const userInfo = response.data;
			console.log('get user');
			const user = await prisma.user.findFirst({
				where: { auth_id: userInfo.sub },
			});

			console.log('Hello', user);

			await prisma.user.update({
				where: {
					email: userInfo.email,
				},
				data: {
					currentTaskId: null,
				},
			});

			res.send('OK');
			break;
<<<<<<< HEAD
			*/
      }
    case 'GET':
      {
        let protocol = 'https://';
        if (req.headers.host?.indexOf('localhost') !== -1) {
          protocol = 'http://';
        }
        const response = await Axios.get(
          protocol + req.headers.host + '/api/auth/me',
          {
            headers: req.headers,
          }
        );
        const userInfo = response.data;
        const user = await prisma.user.findFirst({
          where: { auth_id: userInfo.sub },
        });
=======
		case 'GET':
			{
				let protocol = 'https://';
				if (req.headers.host?.indexOf('localhost') !== -1) {
					protocol = 'http://';
				}
				const response = await Axios.get(
					protocol + req.headers.host + '/api/auth/me',
					{
						headers: req.headers,
					}
				);
				const userInfo = response.data;
				const user = await prisma.user.findFirst({
					where: { auth_id: userInfo.sub },
				});
>>>>>>> ab93904 (Changed user schema, added change status to current task)

        if (user === null) {
          await prisma.user.create({
            data: {
              auth_id: userInfo.sub,
              email: userInfo.email,
            },
          });
        }

        if (user !== null && user.currentTaskId !== null) {
          const task = await prisma.task.findUnique({
            where: {
              id: user.currentTaskId,
            },
          });
          res.json(task);
        } else {
          res.json({ message: 'no task' });
        }
        break;
      }
      {
        /*
		case 'DELETE': {
			await prisma.task.deleteMany({
				where: {
					title: {
						contains: req.body.title,
					},
				},
			});
		}
		*/
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
