// @ts-nocheck
import { makeStyles } from '@material-ui/styles';
import { createStyles, Theme } from '@material-ui/core/styles';
import React, { SyntheticEvent, useState, useEffect, useContext } from 'react';
import { Client, Task } from '.prisma/client';
import Axios from 'axios';
import {
  Box,
  Chip,
  Typography,
  TextField,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Snackbar,
  Alert,
} from '@material-ui/core';
import BugReportOutlinedIcon from '@material-ui/icons/BugReportOutlined';
import CubeTransparentOutlineIcon from '../icons/CubeTransparentOutlineIcon';
import { RequestStatus } from '../../constants/request-status';
import RichTextEditor from './RichTextEditor';
import { convertToRaw } from 'draft-js';
import { AppDataContext } from 'src/contexts/AppContext';

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
      width: '844px',
    },
    requiredSkills: {},
    price: {},
    richTextEditor: {
      height: '50vh',
      '&:focus': {
        border: `1px solid ${theme.palette.primary.light}`,
      },
    },
    richTextEditorContainer: {
      width: '828px',
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
      padding: '6px 16px',
      width: '184px',
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

export default function CreateATask({ client, task }: OwnProps) {
  const classes = useStyles();
  const [title, setTitle] = useState(task === null ? '' : task.name);
  const [shortDesc, setShortDesc] = useState(
    task === null ? '' : task.shortDesc
  );
  const [longDesc, setLongDesc] = useState(task === null ? '' : task.longDesc);
  const [requiredSkills, setRequiredSkills] = useState(
    task === null ? '' : task.skills
  );
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(
    RequestStatus.IDLE
  );
  const [showSuccess, setShowSuccess] = useState(false);
  const [price, setPrice] = useState(task === null ? '' : task.price);
  const [isBugSelected, setIsBugSelected] = useState(
    task === null ? '' : task.type
  );

  const { state } = useContext(AppDataContext);

  useEffect(() => {
    console.log(task);
    //setTitle(task.name);
  }, []);
  const handleSubmit = async () => {
    setRequestStatus(RequestStatus.PENDING);
    try {
      if (task === null) {
        await Axios.post('/api/tasks', {
          clientName: client?.name,
          clientImgUrl: client?.logoUrl,
          clientCategoryId: client?.discordCategoryId,
          name: title,
          shortDesc,
          longDesc: state.serializedEditorState,
          type: isBugSelected ? 'bug' : 'feature',
          skills: requiredSkills,
          clientId: client?.id,
          price: Number(price),
        });
      } else {
        await Axios.put('/api/tasks', {
          params: {
            clientName: client?.name,
            clientImgUrl: client?.logoUrl,
            clientCategoryId: client?.discordCategoryId,
            id: task.id,
            name: title,
            shortDesc: shortDesc,
            longDesc: longDesc,
            type: isBugSelected ? 'bug' : 'feature',
            skills: requiredSkills,
            price: Number(price),
          },
        });
      }

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
          {task === null ? 'Create a task' : 'Update a task'}
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
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
              style={{ marginRight: '16px' }}
              className={classes.price}
              value={price}
              type="number"
              label="Price"
              variant="outlined"
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            <ToggleButtonGroup
              value={isBugSelected}
              exclusive
              onChange={() => {
                setIsBugSelected(!isBugSelected);
              }}
              aria-label="text alignment"
              className="mr-6"
            >
              <ToggleButton
                value="check"
                className="w-full"
                selected={isBugSelected}
                style={{
                  opacity: isBugSelected ? 1.0 : 0.25,
                }}
              >
                <Chip
                  avatar={
                    <BugReportOutlinedIcon
                      style={{
                        fill: '#E00004',
                        background: 'none',
                      }}
                    />
                  }
                  label="Bug"
                  color="primary"
                  style={{ border: 'none', width: '100px' }}
                  variant="outlined"
                />
              </ToggleButton>
              <ToggleButton
                value="check"
                className="w-full"
                selected={!isBugSelected}
                style={{
                  opacity: isBugSelected ? 0.25 : 1.0,
                }}
              >
                <Chip
                  avatar={
                    <CubeTransparentOutlineIcon
                      style={{
                        color: 'rgb(31,87,184)',
                        background: 'none',
                      }}
                    />
                  }
                  label="Feature"
                  color="primary"
                  variant="outlined"
                  style={{ border: 'none', width: '100px' }}
                />
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
          <TextField
            className={classes.requiredSkills}
            value={requiredSkills}
            label="Required Skills"
            variant="outlined"
            onChange={(e) => setRequiredSkills(e.target.value)}
            required
          />
          <div className={classes.richTextEditorContainer}>
            <RichTextEditor className={classes.richTextEditor} />
          </div>
        </form>
        <Button
          className={classes.submitButton}
          variant="contained"
          color="primary"
          size="large"
          disabled={
            !title ||
            !state.serializedEditorState ||
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
