import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextApiHandler } from 'next';
import { prisma } from '../../../../database/prisma';

const taskHandler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case 'GET': {
      try {
        const jobPostings = await prisma.jobPost.findMany({});

        res.json(jobPostings);
      } catch (e) {
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
      } catch (e) {
        console.error(
          `Failed to execute prisma query for job-postings`,
          e.message
        );
        res.status(500).end();
      }
    }
    default: {
      console.error(
        `/api/v2/job-postings called with invalid http method ${req.method}`
      );
      res.status(404).end();
    }
  }
};

export default taskHandler;
