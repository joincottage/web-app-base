import { prisma } from '../../database/prisma';

export default async function getDBIdByOrg(org: string) {
  const clientObj = await prisma.client.findFirst({
    select: {
      notionDBId: true
    },
    where: {
      githubOrgName: org,
    },
  });

  return clientObj?.notionDBId;
}