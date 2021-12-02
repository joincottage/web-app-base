// @ts-nocheck
import { makeStyles } from '@material-ui/styles';
import { createStyles, Theme } from '@material-ui/core/styles';
import React, { SyntheticEvent, useState } from 'react';
import { Client } from '.prisma/client';
import Axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
} from '@material-ui/core';

interface OwnProps {
  client: Client | null;
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
    paper: {
      position: 'absolute',
      width: '400px',
      minHeight: '405px',
      backgroundColor: theme.palette.background.paper,
      borderRadius: '4px',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    closeIcon: {
      cursor: 'pointer',
      position: 'absolute',
      right: '15px',
    },
  })
);

enum RequestStatus {
  IDLE = 'idle',
  PENDING = 'pending',
  FAILED = 'failed',
  SUCCEEDED = 'succeeded',
}

export default function CreateATask({ client }: OwnProps) {
  const classes = useStyles();
  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [longDesc, setLongDesc] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(
    RequestStatus.IDLE
  );
  const [showSuccess, setShowSuccess] = useState(false);
  const [price, setPrice] = useState(0);

  const handleSubmit = async () => {
    setRequestStatus(RequestStatus.PENDING);
    try {
      await Axios.post('/api/tasks', {
        clientName: client?.name,
        clientImgUrl: client?.logoUrl,
        clientCategoryId: client?.discordCategoryId,
        name: title,
        shortDesc,
        longDesc,
        skills: requiredSkills,
        datePosted: new Date().toString(),
        clientId: client?.id,
        price: Number(price),
      });
      setRequestStatus(RequestStatus.SUCCEEDED);
      setShowSuccess(true);
      resetFormState();
    } catch (e) {
      setRequestStatus(RequestStatus.FAILED);
      throw e;
    }
  };
  const resetFormState = () => {
    setTitle('');
    setShortDesc('');
    setLongDesc('');
    setRequiredSkills('');
  };
  const handleCloseShowSuccess = (event: SyntheticEvent<Element, Event>) => {
    setShowSuccess(false);
  };

  return (
    <Box m={4}>
      <div className={classes.root}>
        <Typography variant="h5" gutterBottom>
          Create a task
        </Typography>
        <form className={classes.form} noValidate autoComplete="off">
          <TextField
            className={classes.textField}
            value={title}
            label="Title"
            variant="outlined"
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <TextField
            className={classes.textField}
            value={shortDesc}
            label="Short Description"
            variant="outlined"
            onChange={(e) => setShortDesc(e.target.value)}
            required
          />
          <TextField
            className={classes.textField}
            label="Long Description"
            variant="outlined"
            value={longDesc}
            onChange={(e) => setLongDesc(e.target.value)}
            required
            multiline
            rows={12}
          />
          <TextField
            className={classes.textField}
            value={requiredSkills}
            label="Required Skills"
            variant="outlined"
            onChange={(e) => setRequiredSkills(e.target.value)}
            required
          />
          <TextField
            className={classes.textField}
            value={price}
            type="number"
            label="Price"
            variant="outlined"
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </form>
        <Button
          className={classes.submitButton}
          variant="contained"
          color="primary"
          size="large"
          disabled={
            !title ||
            !shortDesc ||
            !longDesc ||
            !requiredSkills ||
            requestStatus === RequestStatus.PENDING
          }
          onClick={handleSubmit}
        >
          {requestStatus === RequestStatus.PENDING ? 'Submitting...' : 'Submit'}
        </Button>
        {requestStatus === RequestStatus.FAILED ? (
          <div className={classes.error}>
            Something went wrong. We're on it!
          </div>
        ) : null}
      </div>
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
    </Box>
  );
}
