import { NextApiHandler } from 'next';
import { withSentry } from '@sentry/nextjs';
import addTaskToDB, { Task } from 'src/apiService/notion/addTaskToDB';
import createDB from 'src/apiService/notion/createDB';
import getDBIdByOrg from 'src/apiService/notion/getDBIdByOrg';

const taskHandler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case 'POST': {
      if (req.headers.authorization !== process.env.API_ACCESS_TOKEN) {
        res.status(401).json({ message: 'You are not authorized' });
        break;
      }
      
      // org is the name of the client's Github organization
      const org = req.query.org as string;
      if (!org) {
        res.status(400).send('must provide org');

        return;
      }

      const { title, body, issueUrl, requester } = req.body;
      if (!title || !body || !issueUrl || !requester ) {
        res.status(400).send('must provide task details');

        return;
      }

      try {
        let dbCreatedOnRequest = false;
        let notionDBID = await getDBIdByOrg(org as string);
        if (!notionDBID) {
          const notionDB = await createDB(org, req.query.logoUrl as string);
          dbCreatedOnRequest = true;
          notionDBID = notionDB?.id;
        }

        const notionTask = await addTaskToDB(notionDBID as string, { title, body, issueUrl, requester } as Task);

        res.json({ url: `https://notion.so/${notionTask.id}`, dbCreatedOnRequest });
      } catch (e: any) {
        console.error(
          `Failed to create new task in Notion for ${org}: `,
          e.message
        );

        res.status(500).end();

        // Throw error to Sentry
        throw e;
      }

      break;
    }
    default: {
      console.error(
        `/api/notion/customer-kanbans/[:id]/tasks called with invalid http method ${req.method}`
      );
      res.status(404).end();
    }
  }
};

export default withSentry(taskHandler);
