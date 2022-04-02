import React, { useContext, useEffect } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { useUser as useAuth0User } from '@auth0/nextjs-auth0';
import { Fade, Typography } from '@mui/material';
import { AppDataContext } from '../contexts/AppContext';
import useClients from 'src/hooks/useClients';
import setSelectedClient from 'src/actions/setSelectedClient';
import { createStyles, makeStyles } from '@mui/styles';
import { COTTAGE_ANONID } from 'src/constants/cookies';
import useCottageUser from 'src/hooks/useUser';
import Axios from 'axios';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import cookieCutter from 'cookie-cutter';

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
    if (!auth0User || !cottageUser) {
      return;
    }

    // Link cottage_anonid with user object if logged in
    const anonId = cookieCutter.get(COTTAGE_ANONID);
    if (!cottageUser.anonId) {
      Axios.put('/api/v2/users', { anonId, id: cottageUser.id });
    } else if (cottageUser.anonId !== anonId) {
      // Perhaps the user cleared their cookies
      cookieCutter.set(COTTAGE_ANONID, cottageUser.anonId, {
        expires: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000), // 10 years
      });
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
                Your app here
              </Typography>
            </div>
          </div>
        </Box>
      </Container>
    </Fade>
  );
}
