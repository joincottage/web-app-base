import { prisma } from '../../../database/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { decrypt } from '../../../utils/encryption';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.query;

  try {
    const unencryptedEmail = decrypt(email as string);
    switch (req.method) {
      case 'GET':
        const users = await prisma.user.findUnique({
          where: { email: unencryptedEmail },
        });
        res.json(users);
        break;
      default:
        console.error(
          `Unsupported method type ${req.method} made to endpoint ${req.url}`
        );
        res.status(404).end();
        break;
    }
  } catch (e) {
    console.error(`Failed to parse email ${email}`, e);
    res.status(404).end();
  }
}
