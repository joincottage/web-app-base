import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';

export const getUserAuthId = (req: NextApiRequest, res: NextApiResponse) => {
  const session = getSession(req, res);

  return session?.user.sub;
};
