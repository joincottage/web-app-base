import React, { useContext, useEffect, useState } from 'react';
import { createStyles, Theme } from '@material-ui/core/styles';
import { Button, TextField, Typography, Container, Box, Avatar, Alert, Snackbar, Divider, Backdrop, Fade, Modal } from '@material-ui/core';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { makeStyles } from '@material-ui/styles';
import useClient from 'src/hooks/useClients';
import { Client, Task } from '@prisma/client';
import useTasks from 'src/hooks/useTasks';
import TaskCard from 'src/components/TaskCard';
import CloseIcon from '@material-ui/icons/Close';
import { AppDataContext } from 'src/contexts/AppContext';
import CreateATask from 'src/components/CreateATask';
import { useRouter } from 'next/router';

export const getServerSideProps = withPageAuthRequired();

function getModalStyle() {
  return {
    top: `50%`,
    left: `50%`,
    transform: `translate(-50%, -50%)`,
  };
}

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
    },
    paper: {
      position: 'absolute',
      width: '600px',
      minHeight: '405px',
      backgroundColor: theme.palette.background.paper,
      borderRadius: '4px',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    closeIcon: {
      cursor: 'pointer',
      position: 'absolute',
      right: '15px'
    }
  }),
);

export default function ManageTasks() {
  const router = useRouter();
  const classes = useStyles();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const { clients, user, isLoading } = useClient();
  const { loading, error, data: tasks } = useTasks();
  const [isCreateATaskOpen, setIsCreateATaskOpen] = useState(router.query.showCreateTask);
  const { state, dispatch } = useContext(AppDataContext);
  const [modalStyle] = React.useState(getModalStyle);

  useEffect(() => {
    setSelectedClient(clients[0]);
  }, [clients]);

  const handleClickCreateATask = () => {
    setIsCreateATaskOpen(true);
    // sa_event('click_IllDoIt');
  };
  const handleCloseCreateATask = () => {
    setIsCreateATaskOpen(false);
  };

  return (
    <Container maxWidth={false} style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        { clients.map(c => <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: '15px',
              marginRight: '10px',
              marginLeft: '10px',
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
            <Avatar alt="Account" src={c?.logoUrl || ''} aria-haspopup="true" style={{ width: '40px', height: '40px', marginRight: '8px' }} />
            <Typography variant="h7">
              { c.name }
            </Typography>
        </div>)}
      </div>
        <Box m={2} style={{ backgroundColor: 'rgb(244, 245, 248)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
            <Button
              onClick={handleClickCreateATask}
              variant="contained"
              color="primary"
            >
              Create a task
            </Button>
          </div>
          <div style={{ display: 'flex' }}>
            <Box m={2} style={{ flexBasis: '33%' }}>
              <Typography variant="h6" style={{ textAlign: 'center' }} gutterBottom>Task Queue</Typography>
              { loading
                ? 'Loading...'
                : error
                  ? JSON.stringify(error)
                  : tasks?.filter((task: Task) => task.clientName === selectedClient?.name)
                          .filter((task: Task) => task.status === 'task_queued' || !task.status)
                          .reverse()
                          .map((task: Task) => <>
                            <Divider />
                            <TaskCard key={task.id} task={task} />
                          </>)
              }
            </Box>
            <Box m={2} style={{ flexBasis: '33%' }}>
              <Typography variant="h6" style={{ textAlign: 'center' }} gutterBottom>In Progress</Typography>
              { loading
                ? 'Loading...'
                : error
                  ? JSON.stringify(error)
                  : tasks?.filter((task: Task) => task.clientName === selectedClient?.name)
                          .filter((task: Task) => task.status === 'in_progress')
                          .map((task: Task) => <>
                            <Divider />
                            <TaskCard key={task.id} task={task} />
                          </>)
              }
            </Box>
            <Box m={2} style={{ flexBasis: '33%' }}>
              <Typography variant="h6" style={{ textAlign: 'center' }} gutterBottom>Ready for Review</Typography>
              { loading
                ? 'Loading...'
                : error
                  ? JSON.stringify(error)
                  : tasks?.filter((task: Task) => task.clientName === selectedClient?.name)
                          .filter((task: Task) => task.status === 'ready_for_review')
                          .map((task: Task) => <>
                            <Divider />
                            <TaskCard key={task.id} task={task} />
                          </>)
              }
            </Box>
          </div>
      </Box>
      <Modal
        open={isCreateATaskOpen}
        onClose={handleCloseCreateATask}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={isCreateATaskOpen}>
          <div style={modalStyle} className={classes.paper}>
            <CloseIcon onClick={handleCloseCreateATask} className={classes.closeIcon} />
            <CreateATask client={selectedClient} />
          </div>
        </Fade>
      </Modal>
    </Container>
  );
}
