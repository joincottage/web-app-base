import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';

export const getUserAuthEmail = (
  req: NextApiRequest,
  res: NextApiResponse
): string => {
  const session = getSession(req, res);
  if (!session) {
    return '';
  }

  return session.user.email;
};
