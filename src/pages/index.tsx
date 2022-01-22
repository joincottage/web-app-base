import React, { useContext, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Copyright from '../Copyright';
import { useUser as useAuth0User } from '@auth0/nextjs-auth0';
import { Fade, Typography } from '@material-ui/core';
import ClientTabs from 'src/components/ClientTabs';
import UserTasksColumn from 'src/components/UserTasksColumn';
import { AppDataContext } from '../contexts/AppContext';
import useClients from 'src/hooks/useClients';
import setSelectedClient from 'src/actions/setSelectedClient';
import TaskList from 'src/components/TaskList';
import IconAttribution from 'src/components/IconAttribution';
import { createStyles, makeStyles } from '@material-ui/styles';
import { NextPageContext } from 'next';
import { setCookie } from 'src/utils/cookies';
import { v4 as uuidv4 } from 'uuid';
import { COTTAGE_ANONID } from 'src/constants/cookies';
import useCottageUser from 'src/hooks/useUser';
import Axios from 'axios';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import cookieCutter from 'cookie-cutter';

// This needs to be present for any publicly accessible page
export const getServerSideProps = (ctx: NextPageContext) => {
  const { req } = ctx;

  if (!(req as any).cookies.cottage_anonid) {
    setCookie(ctx, COTTAGE_ANONID, uuidv4(), {
      maxAge: 10 * 365 * 24 * 60 * 60 * 1000, // 10 years
    });
  }

  return {
    props: {}, // will be passed to the page component as props
  };
};

const useStyles = makeStyles(() =>
  createStyles({
    title: {
      fontWeight: 600,
    },
  })
);

export default function Index() {
  const { user: auth0User } = useAuth0User();
  const { user: cottageUser } = useCottageUser();
  const { dispatch } = useContext(AppDataContext);
  const { clients } = useClients({
    shouldFetchAll: true,
  });
  const classes = useStyles();

  useEffect(() => {
    dispatch(setSelectedClient({ name: 'All' }));
  }, []);

  useEffect(() => {
    const anonId = cookieCutter.get(COTTAGE_ANONID);

    // Link cottage_anonid with user object if logged in
    if (
      (cottageUser && !cottageUser.anonId) ||
      // Perhaps the user cleared their cookies
      (cottageUser && cottageUser.anonId !== anonId)
    ) {
      Axios.put('/api/v2/users', { anonId, id: cottageUser.id });
    }
  }, [cottageUser]);

  return (
    <Fade in={true}>
      <Container maxWidth="xl">
        <Box my={4}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <div
              className="w-64"
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginRight: '25px',
                width: '95px',
              }}
            >
              <Typography
                variant="subtitle1"
                gutterBottom
                className={`${classes.title} flex justify-center`}
              >
                Clients
              </Typography>
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
                  position: 'sticky',
                  top: '20px',
                }}
              >
                {cottageUser && <UserTasksColumn user={auth0User} />}
              </div>
            </div>
          </div>
          <Copyright />
          <IconAttribution />
        </Box>
      </Container>
    </Fade>
  );
}
