import { prisma } from '../../../database/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { encrypt } from '../../../utils/encryption';
import Axios from 'axios';

const auth0HookToken = process.env.AUTH0_HOOK_TOKEN || '';

export default async function (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  switch (req.method) {
    case 'POST': {
      if (req.headers.authorization !== auth0HookToken) {
        res.status(401).json({ message: 'You are not authorized' });
        break;
      }
      await prisma.user.create({
        data: {
          ...req.body,
        },
      });
      res.send('OK');
      break;
    }
    // case 'PUT':
    //   await prisma.user.update({
    //     data: {
    //       ...req.body,
    //     },
    //   });
    //   res.send('OK');
    //   break;
    case 'GET': {
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
      res.json(user);
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
}

// potential util for testing https://dev.to/jamesharv/comment/145f8
