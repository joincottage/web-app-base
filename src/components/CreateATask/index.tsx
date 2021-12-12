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
  ToggleButton,
  ToggleButtonGroup,
  Snackbar,
  Alert,
} from '@material-ui/core';
import { RequestStatus } from '../../constants/request-status';
import RichTextEditor from './RichTextEditor';

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
    requiredSkills: {},
    price: {},
    richTextEditor: {
      '&:focus': {
        border: `1px solid ${theme.palette.primary.light}`,
      },
    },
    richTextEditorContainer: {
      width: '596px',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      borderRadius: '4px',
      '&:hover': {
        border: '1px solid rgba(0, 0, 0, 0.87)',
      },
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
    closeIcon: {
      cursor: 'pointer',
      position: 'absolute',
      right: '15px',
    },
  })
);

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
  const [bug, setBug] = useState(true);

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
        type: bug ? 'bug' : 'feature',
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
          <ToggleButtonGroup
            value={bug}
            exclusive
            onChange={() => {
              setBug(!bug);
            }}
            aria-label="text alignment"
            className="mr-6"
          >
            <ToggleButton value="check" className="w-full" selected={bug}>
              Bug
            </ToggleButton>
            <ToggleButton value="check" className="w-full" selected={!bug}>
              Feature
            </ToggleButton>
          </ToggleButtonGroup>
          <div className={classes.richTextEditorContainer}>
            <RichTextEditor className={classes.richTextEditor} />
          </div>
          <TextField
            className={classes.requiredSkills}
            value={requiredSkills}
            label="Required Skills"
            variant="outlined"
            onChange={(e) => setRequiredSkills(e.target.value)}
            required
          />
          <TextField
            className={classes.price}
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
