import pubSubClient from './client';
import { AppInsights } from './publishAppInsights';

const subscriptionName = 'app-insights-sub-2';
const timeout = 5;

export interface AppInsightsPayload {
  EventType: string;
  Value: string;
  AnonId: string;
  Metadata: string;
  CreatedAt: string;
  Origin: string;
}

// Triggered from Google Cloud Scheduler: https://console.cloud.google.com/cloudscheduler?authuser=1&project=cottage-328223
const receiveAppInsights = async () =>
  new Promise<AppInsightsPayload[]>((resolve) => {
    const messagePayloads: AppInsightsPayload[] = [];

    // References an existing subscription
    const subscription = pubSubClient.subscription(subscriptionName);

    // Create an event handler to handle messages
    let messageCount = 0;
    const messageHandler = (message: any) => {
      console.log(`Received message ${message.id}:`);
      messageCount += 1;

      const { EventType, Value, AnonId, Metadata, Origin } = JSON.parse(
        message.data
      ) as AppInsights;

      const payload = {
        EventType,
        Value,
        AnonId,
        Metadata,
        CreatedAt: 'AUTO',
        Origin,
      } as AppInsightsPayload;

      messagePayloads.push(payload);

      // "Ack" (acknowledge receipt of) the message
      message.ack();
    };

    // Listen for new messages until timeout is hit
    subscription.on('message', messageHandler);

    setTimeout(() => {
      subscription.removeListener('message', messageHandler);
      console.log(`${messageCount} message(s) received.`);
      resolve(messagePayloads);
    }, timeout * 1000);
  });

export { receiveAppInsights };
