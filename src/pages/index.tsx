import React, { useContext, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Copyright from '../Copyright';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { Fade } from '@material-ui/core';
import ClientTabs from 'src/components/ClientTabs';
import UserTasksColumn from 'src/components/UserTasksColumn';
import { AppDataContext } from '../contexts/AppContext';
import useClients from 'src/hooks/useClients';
import setSelectedClient from 'src/actions/setSelectedClient';
import TaskList from 'src/components/TaskList';

export const getServerSideProps = withPageAuthRequired();

export default function Index() {
  const { user, isLoading } = useUser();
  const { state, dispatch } = useContext(AppDataContext);
  const { clients, loading: clientsLoading } = useClients({
    shouldFetchAll: true,
  });

  useEffect(() => {
    dispatch(setSelectedClient({ name: 'All' }));
  }, []);

  return (
    <Fade in={true}>
      <Container maxWidth="xl">
        <Box my={4}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              maxHeight: '82vh',
            }}
          >
            <div
              className="w-64"
              style={{
                display: 'flex',
                flexDirection: 'row-reverse',
                marginRight: '25px',
              }}
            >
              <ClientTabs clients={clients} />
            </div>
            <TaskList />
            <div className="w-64">
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: '25px',
                }}
              >
                <UserTasksColumn user={user} />
              </div>
            </div>
          </div>
          <Copyright />
        </Box>
      </Container>
    </Fade>
  );
}
