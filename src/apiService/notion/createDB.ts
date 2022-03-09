import { prisma } from '../../database/prisma';
import { getClient } from './client';

async function createNotionDB(parentPageId: string, org: string, logoUrl: string) {
  let notionDB;
  try {
    const notionClient = getClient();
    notionDB = await notionClient.databases.create({
      parent: { page_id: parentPageId },
      title: [{ type: 'text', text: { content: org } }],
      icon: { type: 'external', external: { url: logoUrl }},
      properties: {
        'Name': { type: 'title', title: {} },
        'Status': { type: 'select', select: {
          options: [
            { name: 'Backlog', color: 'gray' },
            { name: 'To Do', color: 'blue' },
            { name: 'In Progress', color: 'yellow' },
            { name: 'Done', color: 'green' }
          ]
        }},
        'Assignee': { type: 'people', people: {}},
        'Due Date': { type: 'date', date: {}},
        'Priority': { type: 'select', select: {
          options: [
            { name: 'Low', color: 'green' },
            { name: 'Medium', color: 'yellow' },
            { name: 'High 🔥', color: 'red' }
          ]
        }},
        'Date Created': { type: 'date', date: {}},
        'Project': { type: 'select', select: {}},
        'Attachment': { type: 'files', files: {}},
        'Label': { type: 'multi_select', multi_select: {}}
      }
    });
  } catch (err) {
    console.error('Failed to create new database in Notion');
    throw err;
  }

  return notionDB;
}

async function saveNotionDBIDAndOrgToCottageDB(id: string, org: string, logoUrl: string) {
  try {
    await prisma.client.create({
      data: {
        userEmailOfOwner: '',
        githubOrgName: org,
        notionDBId: id,
        name: org,
        logoUrl,
      }
    });
  } catch (err) {
    console.error('Failed to add Notion DB ID and Github Org to PlanetScale DB via prisma');
    throw err;
  }
}

export default async function createDB(org: string, logoUrl: string) {
  if (!process.env.NOTION_CUSTOMER_KANBANS_PAGE_ID) {
    console.error('NOTION_CUSTOMER_KANBANS_PAGE_ID must be defined as an environment variable');
    return;
  }
  
  const notionDB = await createNotionDB(process.env.NOTION_CUSTOMER_KANBANS_PAGE_ID, org, logoUrl);
  await saveNotionDBIDAndOrgToCottageDB(notionDB.id, org, logoUrl);

  return notionDB;
}