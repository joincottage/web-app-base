import { NextApiRequest, NextApiResponse } from 'next';
import { decrypt } from 'src/utils/encryption';
import { prisma } from './../../../database/prisma';
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
import Stripe from 'stripe';

const CENTS_IN_A_DOLLAR = 100;

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
    case 'POST':
      try {
        const { task } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
          amount: task.price * CENTS_IN_A_DOLLAR,
          currency: 'usd',
          payment_method_types: ['card'],
          setup_future_usage: 'on_session',
          statement_descriptor: 'Cottage Software INC.',
          metadata: {
            clientName: task.clientName,
          },
        });

        res.json({ client_secret: paymentIntent.client_secret });
      } catch (e) {
        console.error(`Failed to create Stripe secret`, e);
        res.status(500).end();
      }
      break;
    default: {
      console.error(
        `Unsupported method type ${req.method} made to endpoint ${req.url}`
      );
      res.status(404).end();
      break;
    }
  }
}
