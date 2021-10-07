import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ProTip from '../ProTip';
import NextLink from 'next/link';
import Copyright from '../Copyright';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import TaskCard from '../components/TaskCard';
import useTasks from 'src/hooks/useTasks';
import { Task } from '@prisma/client';
import { Avatar, Button } from '@material-ui/core';
import { AccountIconMenu } from 'src/components/AccountIconMenu';
import ClientTabs from 'src/components/ClientTabs';

export const getServerSideProps = withPageAuthRequired();

const mockClients = [{
  name: 'All',
  logo: <div></div>
},{
  name: 'Tabella',
  logo: <Avatar sx={{ width: 24, height: 24 }} alt="Company logo" src={'https://media-exp1.licdn.com/dms/image/C560BAQGUPVCJF9P8bQ/company-logo_100_100/0/1596512454209?e=1641427200&v=beta&t=RI3SjuejiK0mMtrhjTCOXxgmjkUCgVMli64LBtXsRC0'} aria-haspopup="true" />
},{
  name: 'CoachTube',
  logo: <Avatar sx={{ width: 24, height: 24 }} alt="Company logo" src={'https://media-exp1.licdn.com/dms/image/C4D0BAQFLdDnObxfPbA/company-logo_100_100/0/1519922121573?e=1641427200&v=beta&t=7m6vdYkT6ynK4WNjKb3PjFolR_yZNL-vqysovJFmFns'} aria-haspopup="true" />
},{
  name: 'SpiritTree',
  logo: <Avatar sx={{ width: 24, height: 24 }} alt="Company logo" src={'https://pbs.twimg.com/profile_images/1413998231797764105/wkdWkZPO_400x400.jpg'} aria-haspopup="true" />
}];

export default function Index() {
  const { loading, error, data } = useTasks();
  const { user, isLoading } = useUser();
  
  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div>
            <ClientTabs clients={mockClients} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: '600px' }}>
            { loading
              ? 'Loading...'
              : error
                ? JSON.stringify(error)
                : data && data.map((task: Task) => <TaskCard task={task} />)
            }
          </div>
          <div>
            {!isLoading && user ? (<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: '25px' }}>
              <AccountIconMenu user={user} style={{ width: '80px', height: '80px' }} />
              <Typography variant="h6" style={{ textAlign: 'center' }}>Availability</Typography>
              <div>10 hrs/week</div>
            </div>) : (
              !isLoading && (
                <NextLink href="/api/auth/login" passHref={true}>
                  <Button color="inherit">Login</Button>
                </NextLink>
              )
            )}
          </div>
        </div>
        <Copyright />
      </Box>
    </Container>
  );
}
