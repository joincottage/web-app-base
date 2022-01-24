/* eslint-disable no-console */
import { NextApiRequest, NextApiResponse } from 'next';
import { writeToBigQuery } from 'src/apiService/google-bigquery/writeToBigQuery';
import { AppInsights } from 'src/apiService/google-pubsub/publishAppInsights';
import { receiveAppInsights } from 'src/apiService/google-pubsub/receiveAppInsights';
import { withSentry } from '@sentry/nextjs';

interface AnalyticsRequest extends NextApiRequest {
  body: AppInsights;
}

async function receiveHandler(req: AnalyticsRequest, res: NextApiResponse) {
  const { method } = req;

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);

    return;
  }

  try {
    console.log(`Receiving analytics...`);
    const messagePayloads = await receiveAppInsights();
    if (messagePayloads.length > 0) {
      console.log('Writing analytics to database...');
      await writeToBigQuery(messagePayloads);
      console.log('Success');
    } else {
      console.log(
        'No analytics messages found. This probably means that the app has not been visited recently.'
      );
    }
    res.status(200).send('Success');
  } catch (error) {
    console.error(
      `Failed to process request to ${method} /api/analytics/receive`,
      error
    );

    // Throw error to Sentry
    throw error;
  }
}

export default withSentry(receiveHandler);
