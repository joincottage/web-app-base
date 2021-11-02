import React, { useState } from 'react';
import { makeStyles, createStyles } from '@material-ui/styles';
import { Button, Typography, Theme } from '@material-ui/core';
import Axios from 'axios';
import { Task } from '.prisma/client';
import { UserProfile } from '@auth0/nextjs-auth0';

interface OwnProps {
  user: UserProfile;
  task: Task;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
    form: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    submitButton: {
      padding: '25px',
      margin: theme.spacing(1),
    },
    error: {
      color: 'red',
    },
  })
);

enum RequestStatus {
  IDLE = 'idle',
  PENDING = 'pending',
  FAILED = 'failed',
  SUCCEEDED = 'succeeded',
}

export default function IllDoIt({ user, task }: OwnProps) {
  const classes = useStyles();
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(
    RequestStatus.IDLE
  );

  const handleRequestAccess = async () => {
    setRequestStatus(RequestStatus.PENDING);
    try {
      await Axios.post('/api/discord/notify-task-picked-up', {
        name: user?.name,
        discordChannelId: task.discordChannelId,
        discordUserId: user.sub?.split('|')[2],
        task,
      });
      setRequestStatus(RequestStatus.SUCCEEDED);
    } catch (e) {
      setRequestStatus(RequestStatus.FAILED);
      throw e;
    }
  };

  return (
    <div className={classes.root}>
      {requestStatus === RequestStatus.SUCCEEDED ? (
        <>
          <Typography variant="h4" gutterBottom>
            Success
          </Typography>
          <Typography variant="h6" gutterBottom>
            You have picked up this task! You have been added to the task
            channel in Discord. Please open Discord to request additional
            information from the client.
          </Typography>
        </>
      ) : (
        <>
          <Typography variant="h4" gutterBottom>
            Are you sure?
          </Typography>
          <Typography variant="h6" gutterBottom>
            If you click "Yes", the client will be notified that you have picked
            up the task and will expect development to begin.
          </Typography>
          <Button
            className={classes.submitButton}
            variant="contained"
            color="primary"
            size="large"
            disabled={requestStatus === RequestStatus.PENDING}
            onClick={handleRequestAccess}
          >
            {requestStatus === RequestStatus.PENDING
              ? 'Submitting...'
              : "Yes, I'm sure"}
          </Button>
          {requestStatus === RequestStatus.FAILED ? (
            <div className={classes.error}>
              Something went wrong. We&apos;re on it!
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
