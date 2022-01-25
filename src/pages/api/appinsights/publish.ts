/* eslint-disable no-console */
import { NextApiRequest, NextApiResponse } from 'next';
import {
  publishMessage,
  AppInsights,
} from 'src/apiService/google-pubsub/publishAppInsights';
import initMiddleware from 'src/utils/initMiddleware';
import Cors from 'cors';
import { withSentry } from '@sentry/nextjs';

// Initialize the cors middleware
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    origin: ['https://joincottage.com', 'https://app.joincottage.com'],
    // Only allow requests with GET, POST and OPTIONS
    methods: ['GET', 'POST', 'OPTIONS'],
  })
);

interface AppInsightsRequest extends NextApiRequest {
  body: AppInsights;
}

async function publishHandler(req: AppInsightsRequest, res: NextApiResponse) {
  // Run cors
  await cors(req, res);

  const { body, method } = req;
  const { EventType, Value, AnonId, Metadata, Origin, SessionId } = body;

  if (
    EventType === undefined ||
    Value === undefined ||
    AnonId === undefined ||
    Metadata === undefined ||
    Origin === undefined ||
    SessionId === undefined
  ) {
    res.status(400).end(`Required params not found`);

    return;
  }

  if (method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${method} Not Allowed`);

    return;
  }

  try {
    console.log(`Publishing app insights...`);
    await publishMessage(body);
    res.status(200).send('Success');
  } catch (error) {
    console.error(
      `Failed to process request to ${method} /api/appinsights/publish`,
      error
    );

    // Throw error to Sentry
    throw error;
  }
}

export default withSentry(publishHandler);
