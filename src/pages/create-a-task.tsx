import React, { useState } from 'react';
import { createStyles, Theme } from '@material-ui/core/styles';
import { Button, TextField, Typography, FormControlLabel, FormControl, FormLabel, Radio, RadioGroup, Container, Box } from '@material-ui/core';
import Axios from 'axios';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { makeStyles } from '@material-ui/styles';

export const getServerSideProps = withPageAuthRequired();

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

export default function CreateATask() {
  const classes = useStyles();
  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [longDesc, setLongDesc] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(RequestStatus.IDLE);

  const handleRequestAccess = async () => {
    setRequestStatus(RequestStatus.PENDING);
    try {
      await Axios.post('/api/beta-access', { title, shortDesc, longDesc, requiredSkills });
      setRequestStatus(RequestStatus.SUCCEEDED);
    } catch (e) {
      setRequestStatus(RequestStatus.FAILED);
      throw e;
    }
  }

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <div className={classes.root}>
          { requestStatus === RequestStatus.SUCCEEDED
            ? (
              <Typography variant="h5" gutterBottom>
                We have received your request and will reach out soon!
              </Typography>
            )
            : (
              <>
                <Typography variant="h5" gutterBottom>
                  Create a task
                </Typography>
                <form className={classes.form} noValidate autoComplete="off">
                  <TextField className={classes.textField} label="Title" variant="outlined" onChange={e => setTitle(e.target.value)} required/>
                  <TextField className={classes.textField} label="Short Description" variant="outlined" onChange={e => setShortDesc(e.target.value)} required/>
                  <TextField
                    className={classes.textField}
                    label="Long Description"
                    variant="outlined"
                    onChange={e => setLongDesc(e.target.value)}
                    required
                    multiline
                    rows={12}
                    rowsMax={24}
                  />
                  <TextField className={classes.textField} label="Required Skills" variant="outlined" onChange={e => setRequiredSkills(e.target.value)} required/>
                </form>
                <Button
                  className={classes.submitButton}
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={!title || !shortDesc || !longDesc || !requiredSkills || requestStatus === RequestStatus.PENDING}
                  onClick={handleRequestAccess}
                >
                  { requestStatus === RequestStatus.PENDING ? 'Submitting...' : 'Request Beta Access' }
                </Button>
                { requestStatus === RequestStatus.FAILED ? <div className={classes.error}>Something went wrong. We're on it!</div> : null}
              </>
            )}
        </div>
      </Box>
    </Container>
  );
}
