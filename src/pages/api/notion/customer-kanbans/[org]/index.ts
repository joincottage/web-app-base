import { NextApiHandler } from 'next';
import { withSentry } from '@sentry/nextjs';
import getDBIdByOrg from '../../../../../apiService/notion/getDBIdByOrg';
import createDB from 'src/apiService/notion/createDB';

const taskHandler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case 'GET': {
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
      const logoUrl = req.query.logoUrl as string;
      if (!logoUrl) {
        res.status(400).send('must provide logoUrl');

        return;
      }

      try {
        let dbCreatedOnRequest = false;
        let notionDBID = await getDBIdByOrg(org as string);
        if (!notionDBID) {
          const notionDB = await createDB(org, logoUrl);
          dbCreatedOnRequest = true;
          notionDBID = notionDB?.id;
        }

        res.json({ url: `https://notion.so/${notionDBID}`, notionDBID, dbCreatedOnRequest  });
      } catch (e: any) {
        console.error(
          `Failed to create DB in Notion for ${org}`,
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
        `/api/notion/customer-kanbans/[:id] called with invalid http method ${req.method}`
      );
      res.status(404).end();
    }
  }
};

export default withSentry(taskHandler);
