import React, { useState } from 'react';
import { makeStyles, createStyles } from '@material-ui/styles';
import { Button, Typography, Theme } from '@material-ui/core';
//import Axios from 'axios';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      textAlign: 'center',
      minHeight: '405px'
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
      margin: theme.spacing(1)
    },
    error: {
      color: 'red'
    }
  }),
);

enum RequestStatus {
  IDLE='idle',
  PENDING='pending',
  FAILED='failed',
  SUCCEEDED='succeeded'
}

export default function Signup() {
  const classes = useStyles();
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(RequestStatus.IDLE);

  const handleRequestAccess = async () => {
    setRequestStatus(RequestStatus.PENDING);
    try {
      //await Axios.post('/api/beta-access', { name });
      setRequestStatus(RequestStatus.SUCCEEDED);
    } catch (e) {
      setRequestStatus(RequestStatus.FAILED);
      throw e;
    }
  }

  return (
    <div className={classes.root}>
      { requestStatus === RequestStatus.SUCCEEDED
        ? (<>
          <Typography variant="h4" gutterBottom>
            Success
          </Typography>
          <Typography variant="h6" gutterBottom>
            The client has received your request and will reach out soon!
          </Typography>
        </>)
        : (
          <>
            <Typography variant="h4" gutterBottom>
              Are you sure?
            </Typography>
            <Typography variant="h6" gutterBottom>
              You can only apply to perform three tasks at a time. Clicking &quot;Yes, I&apos;m sure&quot; will send your name and a link to your LinkedIn or online portfolio to the client for approval.
            </Typography>
            <Button
              className={classes.submitButton}
              variant="contained"
              color="primary"
              size="large"
              disabled={requestStatus === RequestStatus.PENDING}
              onClick={handleRequestAccess}
            >
              { requestStatus === RequestStatus.PENDING ? 'Submitting...' : "Yes, I'm sure" }
            </Button>
            { requestStatus === RequestStatus.FAILED ? <div className={classes.error}>Something went wrong. We&apos;re on it!</div> : null}
          </>
        )}
    </div>
  );
}