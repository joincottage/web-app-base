// We followed this guide here: https://stripe.com/docs/connect/add-and-pay-out-guide
// We will charge clients per-milestone, subtract our fee, and put the rest of the money
// in the Stripe account so that we can pay out to freelancers for every task completed.

import { NextApiRequest, NextApiResponse } from 'next';
import { decrypt } from 'src/utils/encryption';
import { prisma } from './../../../database/prisma';
import { withSentry } from '@sentry/nextjs';
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
import Stripe from 'stripe';
import { Task } from '.prisma/client';

const CENTS_IN_A_DOLLAR = 100;

const stripe = new Stripe(process.env.STRIPE_AUTH_KEY as string, {
  apiVersion: '2020-08-27',
  typescript: true,
});

const getPayeeUser = async (userId: number) => {
  let error = null;
  const payeeUser = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!payeeUser || !payeeUser.stripeAccountId) {
    error = {
      message: 'Could not find payee user with a valid Stripe account ID',
      httpStatus: 401,
    };
  }

  return { payeeUser, error };
};

async function submitPaymentHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  switch (req.method) {
    case 'POST':
      try {
        const { task } = req.body;

        const taskUserId = (task as Task).userId;
        if (!taskUserId) {
          console.error(
            `Attempting to accept task ${task.id} with no assigned user`
          );
          res.status(400).end();

          return;
        }

        const { payeeUser, error: payeeUserError } = await getPayeeUser(
          taskUserId
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
            metadata: {
              taskId: task.id,
              taskName: task.name,
              payeeUserName: payeeUser?.name || '',
            },
          });
          res.send('OK');
        } catch (err: any) {
          // Error code will be authentication_required if authentication is needed
          console.log('Error code is: ', err.code);
          const paymentIntentRetrieved = await stripe.paymentIntents.retrieve(
            err.raw.payment_intent.id
          );
          console.log('PI retrieved: ', paymentIntentRetrieved.id);

          // Throw error to Sentry
          throw err;
        }
      } catch (e) {
        console.error(`Failed to process Stripe payment`, e);

        // Throw error to Sentry
        throw e;
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

export default withSentry(submitPaymentHandler);
