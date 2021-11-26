import { NextApiRequest, NextApiResponse } from 'next';
import { decrypt, encrypt } from 'src/utils/encryption';
import { prisma } from './../../../database/prisma';
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
import Stripe from 'stripe';
import { Task, User } from '.prisma/client';
import { getSession } from '@auth0/nextjs-auth0';

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

const getPayerUser = async (payerUserEmail: string) => {
  let error = null;
  const payerUser = (await prisma.user.findFirst({
    where: { email: payerUserEmail },
  })) as User;

  if (!payerUser || !payerUser.stripeAccountId) {
    error = {
      message: 'Could not find payer user with a valid Stripe account ID',
      httpStatus: 500,
    };
  }

  return { payerUser, error };
};

const getLoggedInUser = async (req: NextApiRequest, res: NextApiResponse) => {
  let error = null;
  const session = await getSession(req, res);
  const userInfo = session?.user;

  if (userInfo == null) {
    error = {
      message: 'No user is currently logged in',
      httpStatus: 500,
    };
  }

  return { userInfo, error };
};

const createStripeCustomerAndSaveInCottageDB = async (
  payerUserEmail: string
) => {
  let error = null;
  const customer = await stripe.customers.create({
    email: payerUserEmail,
  });
  await prisma.user.update({
    where: { email: payerUserEmail },
    data: {
      stripeCustomerId: customer.id,
    },
  });

  if (!customer) {
    error = {
      message: 'Could not create customer with Stripe API',
      httpStatus: 500,
    };
  }

  return { customerId: customer.id, error };
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

        // We need the email of the currently logged in user to figure out who is setting up a payment method. We can get this from Auth0.
        const { userInfo, error: userInfoError } = await getLoggedInUser(
          req,
          res
        );
        if (userInfoError) {
          // TODO: throw errors to Sentry for monitoring
          console.error(userInfoError.message);
          res.status(userInfoError.httpStatus).end();
          return;
        }

        // We have their email from Auth0, now let's use it to pull their info from the Cottage database.
        // We do this to see if we have already set up a Customer object for this user in Stripe (stripeAccountId).
        const { payerUser, error: payerUserError } = await getPayerUser(
          userInfo?.email
        );
        if (payerUserError) {
          // TODO: throw errors to Sentry for monitoring
          console.error(payerUserError.message);
          res.status(payerUserError.httpStatus).end();
          return;
        }

        // A customer object will have been created in the call to /stripe/secret.ts and the customer ID added to
        // the Cottage User object.
        // customerId needs to be decrypted
        let customerId = decrypt(payerUser.stripeCustomerId as string);

        const paymentMethods = await stripe.paymentMethods.list({
          customer: customerId,
          type: 'card',
        });

        try {
          const paymentIntent = await stripe.paymentIntents.create(
            {
              amount: ((task as Task).price as number) * CENTS_IN_A_DOLLAR,
              currency: 'usd',
              customer: customerId,
              // Default to using the first payment method
              payment_method: paymentMethods.data[0].id,
              off_session: true,
              confirm: true,
            },
            {
              stripeAccount: decrypt(payeeUser?.stripeAccountId as string),
            }
          );
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
