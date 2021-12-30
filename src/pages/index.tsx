import React, { useContext, useEffect, useState } from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Copyright from '../Copyright';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { Fade, Theme, Typography } from '@material-ui/core';
import ClientTabs from 'src/components/ClientTabs';
import UserTasksColumn from 'src/components/UserTasksColumn';
import { AppDataContext } from '../contexts/AppContext';
import useClients from 'src/hooks/useClients';
import setSelectedClient from 'src/actions/setSelectedClient';
import TaskList from 'src/components/TaskList';
import IconAttribution from 'src/components/IconAttribution';
import { createStyles, makeStyles } from '@material-ui/styles';
import Image from 'next/image';
import SmokeMachine from 'src/components/SmokeMachine';

export const getServerSideProps = withPageAuthRequired();

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      fontWeight: 600,
    },
  })
);

export default function Index() {
  const { user, isLoading } = useUser();
  const { state, dispatch } = useContext(AppDataContext);
  const { clients, loading: clientsLoading } = useClients({
    shouldFetchAll: true,
  });
  const classes = useStyles();
  const [offsetY, setOffsetY] = useState(0);
  const [forestOffsetY, setForestOffsetY] = useState(0);

  const handleScroll = () => {
    setOffsetY(window.innerHeight - window.scrollY / 8 - 200);
    setForestOffsetY(window.innerHeight - window.scrollY / 75 - 200);
  };

  useEffect(() => {
    dispatch(setSelectedClient({ name: 'All' }));

    // @ts-ignore
    window.addEventListener('scroll', handleScroll);
    setOffsetY(window.innerHeight - window.scrollY - 200);
    setForestOffsetY(window.innerHeight - window.scrollY - 200);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Fade in={true}>
      <Container maxWidth="xl">
        <div
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            opacity: 0.02,
          }}
        >
          <Image src="/sky.svg" layout="fill" />
        </div>
        <div
          style={{
            position: 'fixed',
            left: '-500px',
            right: 0,
            top: '-325px',
            bottom: 0,
            transform: `translate3d(0, ${forestOffsetY - 700}px, 0)`,
            opacity: 0.05,
          }}
        >
          <Image src="/forest.svg" layout="fixed" width={2800} height={1800} />
        </div>
        <div
          style={{
            position: 'fixed',
            left: '-620px',
            top: '-525px',
            zIndex: -1,
            transform: `translate3d(0, ${offsetY - 300}px, 0)`,
            opacity: 0.15,
          }}
        >
          <SmokeMachine />
        </div>
        <div
          style={{
            position: 'fixed',
            left: '150px',
            top: 0,
            bottom: 0,
            transform: `translate3d(0, ${offsetY}px, 0)`,
            //transform: `translate3d(0, 700px, 0)`,
            opacity: 0.25,
          }}
        >
          <Image src="/cottage.png" width={300} height={300} />
        </div>
        <div
          style={{
            position: 'fixed',
            left: 0,
            bottom: '-450px',
            transform: `translate3d(0, ${offsetY - 700}px, 0)`,
            opacity: 0.1,
          }}
        >
          <Image src="/hill.png" width={500} height={500} />
        </div>
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
                <UserTasksColumn user={user} />
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
