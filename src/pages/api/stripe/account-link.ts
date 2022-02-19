import { getSession } from '@auth0/nextjs-auth0';
import { prisma } from './../../../database/prisma';
import { encrypt } from '../../../utils/encryption';
import { NextApiRequest, NextApiResponse } from 'next';
import { withSentry } from '@sentry/nextjs';
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
import Stripe from 'stripe';

const base = require('airtable').base('appdEwe1Z4gCXfEoB');

const stripe = new Stripe(process.env.STRIPE_AUTH_KEY as string, {
  apiVersion: '2020-08-27',
  typescript: true,
});

async function accountLinkHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  switch (req.method) {
    case 'GET': {
      if (!req.query.recordId || !req.query.userId) {
        res.status(400).send('Bad Request');
        return;
      }

      const account = await stripe.accounts.create({ type: 'express' });
      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: 'https://app.joincottage.com/api/stripe/account-link',
        return_url: 'https://app.cottage.dev',
        type: 'account_onboarding',
      });

      // TODO: assign task to user

      base('Users').update([
        {
          "id": req.query.userId,
          "fields": {
            "stripeAccountId": account.id
          }
        }]);

      // const session = await getSession(req, res);
      // const userInfo = session?.user;

      // if (!userInfo) {
      //   console.log('User not found in Auth0 database');
      //   res.status(401).end();
      //   return;
      // }

      // const user = await prisma.user.findFirst({
      //   where: { auth_id: userInfo.sub },
      // });

      // if (!user) {
      //   console.log('User not found in Cottage database');
      //   res.status(401).end();
      //   return;
      // }

      // await prisma.user.update({
      //   where: {
      //     id: user.id,
      //   },
      //   data: {
      //     stripeAccountId: encrypt(account.id),
      //   },
      // });

      res.redirect(accountLink.url);
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
