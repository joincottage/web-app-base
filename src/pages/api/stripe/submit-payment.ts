import { NextApiRequest, NextApiResponse } from 'next';
import { decrypt } from 'src/utils/encryption';
import { prisma } from './../../../database/prisma';
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
    case 'POST':
      const { taskPrice, payeeUserId } = req.body;

      if (!process.env.COTTAGE_TRANSACTION_FEE_PERCENT) {
        console.error(
          'COTTAGE_TRANSACTION_FEE_PERCENT must be specified as an environment variable'
        );
        res.status(500).end();
        return;
      }

      const payeeUser = await prisma.user.findFirst({
        where: { email: payeeUserId },
      });

      if (!payeeUser || !payeeUser.stripeAccountId) {
        // TODO: throw errors to Sentry for monitoring
        console.error(
          'Could not find payee user with a valid Stripe account ID'
        );
        res.status(500).end();
        return;
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: taskPrice,
        currency: 'usd',
        payment_method_types: ['card'],
      });

    // const session = await stripe.checkout.sessions.create({
    //   line_items: [
    //     {
    //       price: taskPrice,
    //       quantity: 1,
    //     },
    //   ],
    //   mode: 'payment',
    //   success_url: 'https://example.com/success',
    //   cancel_url: 'https://example.com/failure',
    //   payment_intent_data: {
    //     application_fee_amount:
    //       taskPrice *
    //       ((process.env
    //         .COTTAGE_TRANSACTION_FEE_PERCENT as unknown as number) /
    //         100),
    //     transfer_data: {
    //       destination: decrypt(payeeUser.stripeAccountId),
    //     },
    //   },
    // });
    default: {
      console.error(
        `Unsupported method type ${req.method} made to endpoint ${req.url}`
      );
      res.status(404).end();
      break;
    }
  }
}
