import { Client } from "@notionhq/client";

let notionClient: Client | null = null;
export const getClient = () => {
  // Initializing a client
  notionClient = notionClient || new Client({
    auth: process.env.NOTION_INTEGRATION_TOKEN,
  });

  return notionClient;
}