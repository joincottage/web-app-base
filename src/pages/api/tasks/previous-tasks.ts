//https://www.prisma.io/docs/concepts/components/prisma-client/crud
import { prisma } from './../../../database/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
//import { Task, User } from '@prisma/client';
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
			await prisma.task.update({
				where: {
					id: 6,
				},
				data: {
					number: 3,
				},
			});
			res.send('OK');
			break;
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

				if (user === null) {
					await prisma.user.create({
						data: {
							auth_id: userInfo.sub,
							email: userInfo.email,
						},
					});
				}

				//TODO: Change userID to email
				if (user !== null) {
					const tasks = await prisma.task.findMany({
						where: {
							userId: userInfo.email,
							status: 'approved',
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
