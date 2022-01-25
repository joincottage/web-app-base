import pubSubClient from './client';

const TOPIC_NAME = 'app-insights';

export interface AppInsights {
  EventType: string;
  Value: string;
  AnonId: string;
  Metadata: string;
  Origin: string;
  SessionId: string;
}

export async function publishMessage(data: AppInsights) {
  const serializedData = JSON.stringify(data);
  // Publishes the message as a string, e.g. "Hello, world!" or JSON.stringify(someObject)
  const dataBuffer = Buffer.from(serializedData);
  const messageId = await pubSubClient.topic(TOPIC_NAME).publish(dataBuffer);
  console.log(`Message ${messageId} published.`);
}
