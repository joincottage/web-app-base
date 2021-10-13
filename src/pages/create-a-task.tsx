import React, { useContext, useEffect, useState } from 'react';
import { createStyles, Theme } from '@material-ui/core/styles';
import { Button, TextField, Typography, FormControlLabel, FormControl, FormLabel, Radio, RadioGroup, Container, Box, Avatar, Alert, Snackbar, Divider } from '@material-ui/core';
import Axios from 'axios';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { makeStyles } from '@material-ui/styles';
import useClient from 'src/hooks/useClients';
import { Client, Task } from '@prisma/client';
import useTasks from 'src/hooks/useTasks';
import TaskCard from 'src/components/TaskCard';
import { AppDataContext } from 'src/contexts/AppContext';

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
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [longDesc, setLongDesc] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(RequestStatus.IDLE);
  const { clients, user, isLoading } = useClient();
  const [showSuccess, setShowSuccess] = useState(true);
  const { loading, error, data: tasks } = useTasks();
  const { state, dispatch } = useContext(AppDataContext);

  const resetFormState = () => {
    setTitle('');
    setShortDesc('');
    setLongDesc('');
    setRequiredSkills('');
  };

  useEffect(() => {
    setSelectedClient(clients[0])
  }, [clients])

  const handleRequestAccess = async () => {
    setRequestStatus(RequestStatus.PENDING);
    try {
      await Axios.post('/api/tasks', {
        clientName: selectedClient?.name,
        clientImgUrl: selectedClient?.logoUrl,
        name: title,
        shortDesc,
        longDesc,
        skills: requiredSkills,
        datePosted: new Date().toString()
      });
      setRequestStatus(RequestStatus.SUCCEEDED);
      setShowSuccess(true);
      resetFormState();
    } catch (e) {
      setRequestStatus(RequestStatus.FAILED);
      throw e;
    }
  };
  const handleCloseShowSuccess = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowSuccess(false);
  };

  return (
    <Container maxWidth="lg" style={{ display: 'flex' }}>
      <Box m={4}>
        { loading
          ? 'Loading...'
          : error
            ? JSON.stringify(error)
            : state.client.name === 'All'
              ? tasks?.map((task: Task) => <>
                  <Divider />
                  <TaskCard key={task.id} task={task} />
                </>)
              : tasks?.filter((task: Task) =>
                  task.clientName === state.client.name).map((task: Task) => <>
                      <Divider />
                      <TaskCard key={task.id} task={task} />
                    </>)
        }
      </Box>
      <Box m={4}>
        <div className={classes.root}>
          <Typography variant="h5" gutterBottom>
            Create a task
          </Typography>
          <div style={{ display: 'flex' }}>
            { clients.map(c => <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  margin: '15px',
                  opacity: selectedClient?.id === c.id ? 1 : 0.2,
                  cursor: 'pointer'
                }}
                onClick={() => {
                  setSelectedClient(c);
                  dispatch({
                    type: 'SET_SELECTED_CLIENT',
                    payload: { client: {
                      name: c.name || '',
                      logo: <></>,
                      largeLogo: <></>
                    }},
                  });
                }}
              >
                <Avatar alt="Account" src={c?.logoUrl || ''} aria-haspopup="true" style={{ width: '80px', height: '80px', marginRight: '8px' }} />
                <Typography variant="h6" gutterBottom>
                  { c.name }
                </Typography>
              </div>)}
          </div>
          <form className={classes.form} noValidate autoComplete="off">
            <TextField className={classes.textField} value={title} label="Title" variant="outlined" onChange={e => setTitle(e.target.value)} required/>
            <TextField className={classes.textField} value={shortDesc} label="Short Description" variant="outlined" onChange={e => setShortDesc(e.target.value)} required/>
            <TextField
              className={classes.textField}
              label="Long Description"
              variant="outlined"
              value={longDesc}
              onChange={e => setLongDesc(e.target.value)}
              required
              multiline
              rows={12}
              rowsMax={24}
            />
            <TextField className={classes.textField} value={requiredSkills} label="Required Skills" variant="outlined" onChange={e => setRequiredSkills(e.target.value)} required/>
          </form>
          <Button
            className={classes.submitButton}
            variant="contained"
            color="primary"
            size="large"
            disabled={!title || !shortDesc || !longDesc || !requiredSkills || requestStatus === RequestStatus.PENDING}
            onClick={handleRequestAccess}
          >
            { requestStatus === RequestStatus.PENDING ? 'Submitting...' : 'Submit' }
          </Button>
          { requestStatus === RequestStatus.FAILED ? <div className={classes.error}>Something went wrong. We're on it!</div> : null}
          <Snackbar
            open={showSuccess}
            autoHideDuration={6000}
            onClose={handleCloseShowSuccess}
            anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
          >
            <Alert onClose={handleCloseShowSuccess} severity="success">
              Task posted successfully!
            </Alert>
          </Snackbar>
        </div>
      </Box>
    </Container>
  );
}
