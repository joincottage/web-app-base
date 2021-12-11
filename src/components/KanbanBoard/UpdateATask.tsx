// @ts-nocheck
import { makeStyles } from '@material-ui/styles';
import { createStyles, Theme } from '@material-ui/core/styles';
import React, { SyntheticEvent, useState, useEffect } from 'react';
import { Client } from '.prisma/client';
import { Task } from '.prisma/task';
import Axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
} from '@material-ui/core';
import { RequestStatus } from '../../constants/request-status';

interface OwnProps {
  client: Client | null;
  task: Task | null;
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

export default function UpdateATask({ client, task }: OwnProps) {
  const classes = useStyles();
  const [title, setTitle] = useState(task.name);
  const [shortDesc, setShortDesc] = useState(task.shortDesc);
  const [longDesc, setLongDesc] = useState(task.longDesc);
  const [requiredSkills, setRequiredSkills] = useState(task.skills);
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(
    RequestStatus.IDLE
  );
  const [showSuccess, setShowSuccess] = useState(false);
  const [price, setPrice] = useState(task.price);

  useEffect(() => {
    console.log(task);
    //setTitle(task.name);
  }, []);

  const handleSubmit = async () => {
    setRequestStatus(RequestStatus.PENDING);
    try {
      await Axios.put('/api/tasks', {
        params: {
          clientName: client?.name,
          clientImgUrl: client?.logoUrl,
          clientCategoryId: client?.discordCategoryId,
          id: task.id,
          name: title,
          shortDesc: shortDesc,
          longDesc: longDesc,
          skills: requiredSkills,
          price: Number(price),
          datePosted: new Date().toString(),
        },
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
          Update a task
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
          Task updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}
