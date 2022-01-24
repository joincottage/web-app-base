import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from 'next';
import { withSentry } from '@sentry/nextjs';

const stripeAPIKey = process.env.STRIPE_AUTH_KEY || '';
const stripe = new Stripe(stripeAPIKey, { apiVersion: '2020-08-27' });

async function createStripeAccountHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { method } = req;

  if (method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${method} Not Allowed`);

    return;
  }

  const account = await stripe.accounts.create({
    country: 'US',
    type: 'express',
    capabilities: {
      card_payments: {
        requested: true,
      },
      transfers: {
        requested: true,
      },
    },
  });

  const accountLinks = await stripe.accountLinks.create({
    account: account.id,
    type: 'account_onboarding',
    refresh_url: 'http://localhost:3000/',
    return_url: 'http://localhost:3000/',
  });

  res.redirect(accountLinks.url);
}

export default withSentry(createStripeAccountHandler);
