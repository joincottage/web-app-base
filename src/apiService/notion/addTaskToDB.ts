import { getClient } from './client';

export interface Task {
  title: string;
  body: string;
  issueUrl: string;
  requester: string;
  priority?: 'Low' | 'Medium' | 'High 🔥';
}

export default async function addTaskToDB(databaseId: string, task: Task) {
  let notionPage;
  try {
    const notionClient = getClient();
    notionPage = await notionClient.pages.create({
      parent: { database_id: databaseId },
      properties: {
        'Name': [{ type: 'text', text: { content: task.title } }],
        'Status': { name: 'Backlog' },
      },
      children: [{
        "paragraph": {
          "rich_text": [{
            "type": "text",
            "text": {
              "content": `Issue URL: ${task.issueUrl}\nRequester: ${task.requester}\n\n${task.body}`,
              "link": null
            }
          }],
        }
      }]
    });
  } catch (err) {
    console.error('Failed to create new task in Notion');
    throw err;
  }

  return notionPage;
}