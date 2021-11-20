import { NextApiRequest, NextApiResponse } from 'next';
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
import Stripe from 'stripe';

const stripe = new Stripe(
  'sk_test_51JFMlLAUYz6Zd3huPRlc0iHX4HkV8qvnCR3ek83u4xk1UMgOnlSuo6LGGp71va8Mnf58R2p8RLifP8crrgnIhB3O00u2NNyKEs',
  {
    apiVersion: '2020-08-27',
    typescript: true,
  }
);

export default async function (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  switch (req.method) {
    case 'GET': {
      const account = await stripe.accounts.create({ type: 'express' });
      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: 'https://app.joincottage.com/stripe-onboarding',
        return_url: 'https://app.joincottage.com',
        type: 'account_onboarding',
      });

      res.send({ onboarding_url: accountLink.url });
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
