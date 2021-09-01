import { NextApiRequest, NextApiResponse } from 'next';

export const cookieMiddleware =
  (fn: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) =>
  (req: NextApiRequest, res: NextApiResponse) => {
    console.log('in the middleware..');
    return fn(req, res);
  };
