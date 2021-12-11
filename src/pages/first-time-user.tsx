import React, { useContext } from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import NextLink from 'next/link';
import Copyright from '../Copyright';
import {
  UserProfile,
  useUser,
  withPageAuthRequired,
} from '@auth0/nextjs-auth0';
import TaskCard from '../components/TaskList/TaskCard';
import useTasks from 'src/hooks/useTasks';
import { Task } from '@prisma/client';
import { Avatar, Button } from '@material-ui/core';
import { AccountIconMenu } from 'src/components/AccountIconMenu';
import ClientTabs from 'src/components/ClientTabs';
import { AppDataContext } from '../contexts/AppContext';
import Divider from '@material-ui/core/Divider';
import { createInviteLink } from 'src/apiService/discord/invite';
import { useRouter } from 'next/router';

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    return {
      props: {
        inviteLink: await createInviteLink(),
      },
    };
  },
});

interface OwnProps {
  user: UserProfile;
  inviteLink: string;
}

export default function FirstTimeUser({ user, inviteLink }: OwnProps) {
  const router = useRouter();
  const handleJoinDiscord = () => {
    // @ts-ignore
    window.open(inviteLink, '_blank').focus();
  };

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant="h3" gutterBottom>
            Welcome {user.name}!
          </Typography>
          <Typography variant="h5" gutterBottom>
            Discord is used to facilitate communication between clients and
            freelancers.
          </Typography>
          <Typography variant="h5" gutterBottom>
            Click the link below to join the server.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleJoinDiscord}
            style={{ marginTop: '15px' }}
          >
            Join the Cottage Discord server
          </Button>
        </div>
        <Copyright />
      </Box>
    </Container>
  );
}
