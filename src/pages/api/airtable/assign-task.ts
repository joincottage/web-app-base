// import { getSession } from '@auth0/nextjs-auth0';
// import { prisma } from './../../../database/prisma';
// import { encrypt } from '../../../utils/encryption';
import { NextApiRequest, NextApiResponse } from 'next';
import { withSentry } from '@sentry/nextjs';
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
// import Stripe from 'stripe';
import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  'appdEwe1Z4gCXfEoB'
);

// const stripe = new Stripe(process.env.STRIPE_AUTH_KEY as string, {
//   apiVersion: '2020-08-27',
//   typescript: true,
// });

async function accountLinkHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  switch (req.method) {
    case 'GET': {
      if (!req.query.userId || !req.query.redirect || !req.query.recordId) {
        res.status(400).send('Bad Request');
        return;
      }

      const user = await new Promise((resolve, reject) =>
        base('Users').find(req.query.userId as string, function (err, record) {
          if (err) {
            console.error(err);
            reject(err);
            return;
          }
          resolve(record);
        })
      );

      await base('Tasks').update([
        {
          id: req.query.recordId as string,
          fields: {
            Status: 'In Progress',
            Assignee: [req.query.userId as string],
            'Assignee ID': req.query.userId as string,
            'Assignee Email': (user as any).fields.Email,
          },
        },
      ]);

      res.redirect(req.query.redirect as string);
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

export default withSentry(accountLinkHandler);
