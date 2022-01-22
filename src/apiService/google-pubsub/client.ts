// Imports the Google Cloud client library
import { PubSub } from '@google-cloud/pubsub';

// Creates a client; cache this for further use
const pubSubClient = new PubSub({
  credentials: {
    client_id: process.env.GOOGLE_PUBSUB_CLIENT_ID,
    client_email: process.env.GOOGLE_PUBSUB_CLIENT_EMAIL,
    private_key:
      process.env.GOOGLE_PUBSUB_PRIVATE_KEY &&
      process.env.GOOGLE_PUBSUB_PRIVATE_KEY.replace(/\\n/gm, '\n'),
  },
  projectId: process.env.GOOGLE_PUBSUB_PROJECT_ID,
});

export default pubSubClient;
