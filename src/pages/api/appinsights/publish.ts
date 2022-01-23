/* eslint-disable no-console */
import { NextApiRequest, NextApiResponse } from 'next';
import {
  publishMessage,
  AppInsights,
} from 'src/apiService/google-pubsub/publishAppInsights';
import initMiddleware from 'src/utils/initMiddleware';
import Cors from 'cors';

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

export default async function publish(
  req: AppInsightsRequest,
  res: NextApiResponse
) {
  // Run cors
  await cors(req, res);

  const { body, method } = req;
  const { EventType, Value, AnonId, Metadata, Origin } = body;

  if (
    EventType === undefined ||
    Value === undefined ||
    AnonId === undefined ||
    Metadata === undefined ||
    Origin === undefined
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
    console.log(`Publishing app insights... ${JSON.stringify(body)}`);
    await publishMessage(body);
    res.status(200).send('Success');
  } catch (error) {
    console.error(
      `Failed to process request to ${method} /api/appinsights/publish`,
      error
    );
    res.status(500).json({ message: 'Server error' });
  }
}
