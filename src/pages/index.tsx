import React, { useContext } from 'react';
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
import { AppDataContext } from '../contexts/AppContext';

export const getServerSideProps = withPageAuthRequired();

const mockClients = [{
  name: 'All',
  logo: <div></div>
},{
  name: 'Tabella',
  logo: <Avatar sx={{ width: 24, height: 24 }} alt="Company logo" src={'https://media-exp1.licdn.com/dms/image/C560BAQGUPVCJF9P8bQ/company-logo_100_100/0/1596512454209?e=1641427200&v=beta&t=RI3SjuejiK0mMtrhjTCOXxgmjkUCgVMli64LBtXsRC0'} aria-haspopup="true" />,
  largeLogo: <Avatar sx={{ width: 80, height: 80 }} alt="Company logo" src={'https://media-exp1.licdn.com/dms/image/C560BAQGUPVCJF9P8bQ/company-logo_100_100/0/1596512454209?e=1641427200&v=beta&t=RI3SjuejiK0mMtrhjTCOXxgmjkUCgVMli64LBtXsRC0'} aria-haspopup="true" />
},{
  name: 'CoachTube',
  logo: <Avatar sx={{ width: 24, height: 24 }} alt="Company logo" src={'https://media-exp1.licdn.com/dms/image/C4D0BAQFLdDnObxfPbA/company-logo_100_100/0/1519922121573?e=1641427200&v=beta&t=7m6vdYkT6ynK4WNjKb3PjFolR_yZNL-vqysovJFmFns'} aria-haspopup="true" />,
  largeLogo: <Avatar sx={{ width: 80, height: 80 }} alt="Company logo" src={'https://media-exp1.licdn.com/dms/image/C4D0BAQFLdDnObxfPbA/company-logo_100_100/0/1519922121573?e=1641427200&v=beta&t=7m6vdYkT6ynK4WNjKb3PjFolR_yZNL-vqysovJFmFns'} aria-haspopup="true" />
},{
  name: 'SpiritTree',
  logo: <Avatar sx={{ width: 24, height: 24 }} alt="Company logo" src={'https://pbs.twimg.com/profile_images/1413998231797764105/wkdWkZPO_400x400.jpg'} aria-haspopup="true" />,
  largeLogo: <Avatar sx={{ width: 80, height: 80 }} alt="Company logo" src={'https://pbs.twimg.com/profile_images/1413998231797764105/wkdWkZPO_400x400.jpg'} aria-haspopup="true" />
},{
  name: 'Piggybank',
  logo: <Avatar sx={{ width: 24, height: 24 }} alt="Company logo" src={'https://media-exp1.licdn.com/dms/image/C4D0BAQHClt0kh3jkzQ/company-logo_100_100/0/1631221115874?e=1642032000&v=beta&t=-h12TZPgGFBEqSMc3YSS3Xmkj9reLHGhtDrgbge2IQ8'} aria-haspopup="true" />,
  largeLogo: <Avatar sx={{ width: 80, height: 80 }} alt="Company logo" src={'https://media-exp1.licdn.com/dms/image/C4D0BAQHClt0kh3jkzQ/company-logo_100_100/0/1631221115874?e=1642032000&v=beta&t=-h12TZPgGFBEqSMc3YSS3Xmkj9reLHGhtDrgbge2IQ8'} aria-haspopup="true" />
},{
  name: 'Strong Network',
  logo: <Avatar sx={{ width: 24, height: 24 }} alt="Company logo" src={'https://media-exp1.licdn.com/dms/image/C4D0BAQGo_dRkMmWYVA/company-logo_200_200/0/1607589671903?e=1642032000&v=beta&t=_ad8jMQh0msfzuyqo_M0TGBeFZjijrC3GHtV1qNX0zg'} aria-haspopup="true" />,
  largeLogo: <Avatar sx={{ width: 80, height: 80 }} alt="Company logo" src={'https://media-exp1.licdn.com/dms/image/C4D0BAQGo_dRkMmWYVA/company-logo_200_200/0/1607589671903?e=1642032000&v=beta&t=_ad8jMQh0msfzuyqo_M0TGBeFZjijrC3GHtV1qNX0zg'} aria-haspopup="true" />
},{
  name: 'Cottage',
  logo: <Avatar sx={{ width: 24, height: 24 }} alt="Company logo" src={'https://media-exp1.licdn.com/dms/image/C4E0BAQF3nI3dMkialQ/company-logo_100_100/0/1625689480587?e=1642032000&v=beta&t=pVqZQLKd1l4XS3m5RHxT8avXdekg4v0EeZOeAnmC9uM'} aria-haspopup="true" />,
  largeLogo: <Avatar sx={{ width: 80, height: 80 }} alt="Company logo" src={'https://media-exp1.licdn.com/dms/image/C4E0BAQF3nI3dMkialQ/company-logo_100_100/0/1625689480587?e=1642032000&v=beta&t=pVqZQLKd1l4XS3m5RHxT8avXdekg4v0EeZOeAnmC9uM'} aria-haspopup="true" />
}];

export default function Index() {
  const { loading, error, data } = useTasks();
  const { user, isLoading } = useUser();
  const { state } = useContext(AppDataContext);
  
  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div>
            <ClientTabs clients={mockClients} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: '600px', maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '15px' }}>
              <span style={{ marginRight: '15px' }}>{ state.client.largeLogo }</span>
              <Typography variant="h6" style={{ paddingRight: '30px' }}>{ state.client.name }</Typography>
            </div>
            { loading
              ? 'Loading...'
              : error
                ? JSON.stringify(error)
                : state.client.name === 'All'
                  ? data?.map((task: Task) => <TaskCard task={task} client={state.client} />)
                  : data?.filter((task: Task) => task.clientName === state.client.name).map((task: Task) => <TaskCard task={task} />)
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
