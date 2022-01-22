// Import the Google Cloud client library
import { BigQuery } from '@google-cloud/bigquery';
import { AppInsightsPayload } from '../google-pubsub/receiveAppInsights';

const DATASET_ID = 'appinsights';
const TABLE_ID = 'main';

export async function writeToBigQuery(rows: AppInsightsPayload[]) {
  // [START bigquery_table_insert_rows]
  const bigquery = new BigQuery({
    credentials: {
      client_id: process.env.GOOGLE_PUBSUB_CLIENT_ID,
      client_email: process.env.GOOGLE_PUBSUB_CLIENT_EMAIL,
      private_key:
        process.env.GOOGLE_PUBSUB_PRIVATE_KEY &&
        process.env.GOOGLE_PUBSUB_PRIVATE_KEY.replace(/\\n/gm, '\n'),
    },
    projectId: process.env.GOOGLE_PUBSUB_PROJECT_ID,
  });

  try {
    await bigquery.dataset(DATASET_ID).table(TABLE_ID).insert(rows);
    console.log(`Inserted ${rows.length} rows`);
  } catch (err) {
    console.error('Failure in writeToBigQuery()', err);
    throw err;
  }
}
