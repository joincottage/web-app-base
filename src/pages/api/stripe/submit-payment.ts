// We followed this guide here: https://stripe.com/docs/connect/add-and-pay-out-guide
// We will charge clients per-milestone, subtract our fee, and put the rest of the money
// in the Stripe account so that we can pay out to freelancers for every task completed.

import { NextApiRequest, NextApiResponse } from 'next';
import { decrypt, encrypt } from 'src/utils/encryption';
import { prisma } from './../../../database/prisma';
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
import Stripe from 'stripe';
import { Task, User } from '.prisma/client';

const CENTS_IN_A_DOLLAR = 100;

const stripe = new Stripe(
  'sk_test_51JFMlLAUYz6Zd3huPRlc0iHX4HkV8qvnCR3ek83u4xk1UMgOnlSuo6LGGp71va8Mnf58R2p8RLifP8crrgnIhB3O00u2NNyKEs',
  {
    apiVersion: '2020-08-27',
    typescript: true,
  }
);

const getPayeeUser = async (userId: string) => {
  let error = null;
  const payeeUser = await prisma.user.findFirst({
    where: { email: userId },
  });

  if (!payeeUser || !payeeUser.stripeAccountId) {
    error = {
      message: 'Could not find payee user with a valid Stripe account ID',
      httpStatus: 401,
    };
  }

  return { payeeUser, error };
};

export default async function (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  switch (req.method) {
    case 'POST':
      try {
        const { task } = req.body;

        const { payeeUser, error: payeeUserError } = await getPayeeUser(
          (task as Task).userId as string
        );
        if (payeeUserError) {
          // TODO: throw errors to Sentry for monitoring
          console.error(payeeUserError.message);
          res.status(payeeUserError.httpStatus).end();
          return;
        }

        try {
          await stripe.transfers.create({
            amount: ((task as Task).price as number) * CENTS_IN_A_DOLLAR,
            currency: 'usd',
            destination: decrypt(payeeUser?.stripeAccountId as string),
          });
          res.send('OK');
        } catch (err) {
          // Error code will be authentication_required if authentication is needed
          console.log('Error code is: ', err.code);
          const paymentIntentRetrieved = await stripe.paymentIntents.retrieve(
            err.raw.payment_intent.id
          );
          console.log('PI retrieved: ', paymentIntentRetrieved.id);
        }
      } catch (e) {
        console.error(`Failed to process Stripe payment`, e);
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
