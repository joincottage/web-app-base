import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ProTip from '../ProTip';
import NextLink from 'next/link';
import Copyright from '../Copyright';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import TaskCard from '../components/TaskCard';
import useTasks from 'src/hooks/useTasks';
import { Task } from '@prisma/client';

export const getServerSideProps = withPageAuthRequired();

export default function Index() {
  const { loading, error, data } = useTasks();
  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Available tasks
        </Typography>
        { loading
          ? 'Loading...'
          : error
            ? JSON.stringify(error)
            : data && data.map((task: Task) => <TaskCard task={task} />)
        }
        <ProTip />
        <Copyright />
      </Box>
    </Container>
  );
}
