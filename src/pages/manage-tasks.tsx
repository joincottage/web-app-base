import React, { useContext, useEffect, useState } from 'react';
import { createStyles, Theme } from '@material-ui/core/styles';
import {
  Button,
  TextField,
  Typography,
  Container,
  Box,
  Avatar,
  Alert,
  Snackbar,
  Divider,
  Backdrop,
  Fade,
  Modal,
} from '@material-ui/core';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { makeStyles } from '@material-ui/styles';
import useClient from 'src/hooks/useClients';
import { Client, Task } from '@prisma/client';
import useTasks from 'src/hooks/useTasks';
import TaskCard from 'src/components/TaskCard';
import { AppDataContext } from 'src/contexts/AppContext';
import CreateATask from 'src/components/CreateATask';
import { useRouter } from 'next/router';
import KanbanBoard from 'src/components/KanbanBoard';

export const getServerSideProps = withPageAuthRequired();

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    textAlign: 'center',
    minHeight: '405px',
  },
  textField: {
    margin: theme.spacing(1),
  },
  submitButton: {
    padding: '25px',
    margin: theme.spacing(1),
  },
  error: {
    color: 'red',
  },
}));

export default function ManageTasks() {
  const router = useRouter();
  const classes = useStyles();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const { clients, user, isLoading } = useClient();
  const { state, dispatch } = useContext(AppDataContext);

  useEffect(() => {
    setSelectedClient(
      clients.find((c) => c.name === router.query.selectedClientName) ||
        clients[0]
    );
  }, [clients, router.query]);

  return (
    <Container
      maxWidth={false}
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      <div className={classes.root}>
        {clients.length > 0 ? (
          <>
            {clients.map((c) => (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginTop: '15px',
                  marginRight: '10px',
                  marginLeft: '10px',
                  opacity: selectedClient?.id === c.id ? 1 : 0.2,
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setSelectedClient(c);
                  dispatch({
                    type: 'SET_SELECTED_CLIENT',
                    payload: {
                      client: {
                        name: c.name || '',
                        logo: <></>,
                        largeLogo: <></>,
                      },
                    },
                  });
                }}
              >
                <Avatar
                  alt="Account"
                  src={c?.logoUrl || ''}
                  aria-haspopup="true"
                  style={{ width: '40px', height: '40px', marginRight: '8px' }}
                />
                <Typography variant="h6">{c.name}</Typography>
              </div>
            ))}
            <KanbanBoard client={selectedClient} />
          </>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '90vh',
            }}
          >
            <img
              src="/logo-icon.jpeg"
              alt="logo"
              style={{ marginBottom: '15px', width: '200px', height: '200px' }}
            />
            <Button variant="contained" color="primary" size="large">
              Register as a client
            </Button>
          </div>
        )}
      </div>
    </Container>
  );
}
