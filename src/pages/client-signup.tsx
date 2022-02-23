import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Theme,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { createStyles, makeStyles } from '@mui/styles';
import Axios from 'axios';
import { useRouter } from 'next/dist/client/router';
import React, { useState } from 'react';

export const getServerSideProps = withPageAuthRequired();

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

export default function ClientSignup() {
  const classes = useStyles();
  const router = useRouter();
  const [companyName, setCompanyName] = useState('');
  const [companyLogo, setCompanyLogo] = useState('');
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(
    RequestStatus.IDLE
  );
  const { user } = useUser();

  const handleRequestAccess = async () => {
    setRequestStatus(RequestStatus.PENDING);
    try {
      await Axios.post('/api/clients', {
        name: companyName,
        logoUrl: companyLogo,
        userEmailOfOwner: user?.email,
      });
      router.push('/create-a-task');
    } catch (e) {
      setRequestStatus(RequestStatus.FAILED);
      throw e;
    }
  };

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <div className={classes.root}>
          <Typography variant="h5" gutterBottom>
            Give us a few more details!
          </Typography>
          <form className={classes.form} noValidate autoComplete="off">
            <TextField
              className={classes.textField}
              label="Company Name"
              variant="outlined"
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
            <TextField
              className={classes.textField}
              label="Link to company logo"
              variant="outlined"
              onChange={(e) => setCompanyLogo(e.target.value)}
              required
            />
          </form>
          <Avatar
            alt="Company logo"
            src={companyLogo || ''}
            aria-haspopup="true"
            style={{ width: '120px', height: '120px', marginTop: '25px' }}
          />
          <Typography
            variant="h6"
            gutterBottom
            style={{ marginBottom: '25px' }}
          >
            {companyName}
          </Typography>
          <Button
            className={classes.submitButton}
            variant="contained"
            color="primary"
            size="large"
            disabled={
              !companyName ||
              !companyLogo ||
              requestStatus === RequestStatus.PENDING
            }
            onClick={handleRequestAccess}
          >
            {requestStatus === RequestStatus.PENDING
              ? 'Submitting...'
              : 'Create my first task'}
          </Button>
          {requestStatus === RequestStatus.FAILED ? (
            <div className={classes.error}>
              Something went wrong. We&apos;re on it!
            </div>
          ) : null}
        </div>
      </Box>
    </Container>
  );
}
