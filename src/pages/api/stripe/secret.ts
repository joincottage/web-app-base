import { NextApiRequest, NextApiResponse } from 'next';
import { decrypt, encrypt } from 'src/utils/encryption';
import { prisma } from './../../../database/prisma';
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
import Stripe from 'stripe';
import { User } from '.prisma/client';
import { getSession } from '@auth0/nextjs-auth0';
import { withSentry } from '@sentry/nextjs';

const stripe = new Stripe(process.env.STRIPE_AUTH_KEY as string, {
  apiVersion: '2020-08-27',
  typescript: true,
});

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
      stripeCustomerId: encrypt(customer.id),
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

async function secretHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  switch (req.method) {
    case 'POST':
      try {
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

        // Stripe requires the creation of a Customer object to store payment methods.
        // https://stripe.com/docs/payments/save-and-reuse?html-or-react=react
        let customerId =
          payerUser.stripeCustomerId && decrypt(payerUser.stripeCustomerId);
        if (!customerId) {
          const { customerId: newCustomerId, error: customerIdError } =
            await createStripeCustomerAndSaveInCottageDB(payerUser.email);
          if (customerIdError) {
            // TODO: throw errors to Sentry for monitoring
            console.error(customerIdError.message);
            res.status(customerIdError.httpStatus).end();
            return;
          }
          customerId = newCustomerId;
        }

        // Now we can create a setupIntent that will create a secret that the UI can use to allow our user to fill in credit card info and track the session.
        const setupIntent = await stripe.setupIntents.create({
          customer: customerId,
          payment_method_types: ['card'],
        });
        res.json({ client_secret: setupIntent.client_secret });
      } catch (e) {
        console.error(`Failed to create Stripe secret`, e);

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

export default withSentry(secretHandler);
