//https://www.prisma.io/docs/concepts/components/prisma-client/crud
import { prisma } from './../../../database/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import Axios from 'axios';
import { getSession } from '@auth0/nextjs-auth0';

export default async function (
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> {
	switch (req.method) {
		case 'POST': {
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
		//MARK: Change current task to in_review
		case 'PUT':
			await prisma.task.update({
				where: {
					id: req.body.task.id,
				},
				data: {
					status: 'in_review',
				},
			});

			res.send('OK');
			break;
		case 'GET':
			{
				const session = getSession(req, res);
				const userInfo = session?.user;

				if (userInfo == null) {
					res.status(401).end();
					return;
				}

				const user = await prisma.user.findFirst({
					where: { auth_id: userInfo.sub },
				});

				if (user === null) {
					await prisma.user.create({
						data: {
							auth_id: userInfo.sub,
							email: userInfo.email,
						},
					});
				}

				if (user !== null) {
					const tasks = await prisma.task.findMany({
						where: {
							userId: userInfo.email,
							status: 'in_progress',
						},
					});
					res.json(tasks);
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
