import { NextApiHandler } from 'next';
import { prisma } from '../../../../database/prisma';
import { withSentry } from '@sentry/nextjs';

const jobPostingsHandler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case 'GET': {
      try {
        const jobPostings = await prisma.jobPost.findMany({});

        res.json(jobPostings);
      } catch (e: any) {
        console.error(
          `Failed to execute prisma query for job-postings`,
          e.message
        );
        res.status(500).end();
      }

      break;
    }
    case 'POST': {
      try {
        const { jobPostings } = req.body;

        await prisma.jobPost.createMany({
          data: jobPostings,
        });

        res.status(201).end();
      } catch (e: any) {
        console.error(
          `Failed to execute prisma query for job-postings`,
          e.message
        );

        // Throw error to Sentry
        throw e;
      }

      break;
    }
    default: {
      console.error(
        `/api/v2/job-postings called with invalid http method ${req.method}`
      );
      res.status(404).end();
    }
  }
};

export default withSentry(jobPostingsHandler);
