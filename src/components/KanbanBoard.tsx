import {
  Backdrop,
  Box,
  Button,
  createStyles,
  Divider,
  Fade,
  Modal,
  Theme,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Client, Task } from '@prisma/client';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import useTasks from 'src/hooks/useTasks';
import CreateATask from './CreateATask';
import TaskCard from './TaskCard';
import CloseIcon from '@material-ui/icons/Close';

interface OwnProps {
  client: Client | null;
}

function getModalStyle() {
  return {
    top: `50%`,
    left: `50%`,
    transform: `translate(-50%, -50%)`,
  };
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
      right: '15px',
    },
  })
);

const KanbanBoard = ({ client }: OwnProps) => {
  const router = useRouter();
  const { loading, error, data: tasks } = useTasks();
  const [isCreateATaskOpen, setIsCreateATaskOpen] = useState(
    router.query.showCreateTask === 'true'
  );
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  const handleClickCreateATask = () => {
    setIsCreateATaskOpen(true);
    // sa_event('click_IllDoIt');
  };
  const handleCloseCreateATask = () => {
    setIsCreateATaskOpen(false);
  };

  return (
    <>
      <div style={{ display: 'flex' }}>
        <Box m={2} style={{ backgroundColor: 'rgb(244, 245, 248)' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '15px',
            }}
          >
            <Button
              onClick={handleClickCreateATask}
              variant="contained"
              color="primary"
            >
              Create a task
            </Button>
          </div>
          <Box m={2} style={{ flexBasis: '33%' }}>
            <Typography
              variant="h6"
              style={{ textAlign: 'center' }}
              gutterBottom
            >
              Task Queue
            </Typography>
            {loading
              ? 'Loading...'
              : error
              ? JSON.stringify(error)
              : tasks
                  ?.filter((task: Task) => task.clientName === client?.name)
                  .filter(
                    (task: Task) =>
                      task.status === 'task_queued' || !task.status
                  )
                  .reverse()
                  .map((task: Task) => (
                    <>
                      <Divider />
                      <TaskCard key={task.id} task={task} mode="client" />
                    </>
                  ))}
          </Box>
          <Box m={2} style={{ flexBasis: '33%' }}>
            <Typography
              variant="h6"
              style={{ textAlign: 'center' }}
              gutterBottom
            >
              In Progress
            </Typography>
            {loading
              ? 'Loading...'
              : error
              ? JSON.stringify(error)
              : tasks
                  ?.filter((task: Task) => task.clientName === client?.name)
                  .filter((task: Task) => task.status === 'in_progress')
                  .map((task: Task) => (
                    <>
                      <Divider />
                      <TaskCard key={task.id} task={task} mode="client" />
                    </>
                  ))}
          </Box>
          <Box m={2} style={{ flexBasis: '33%' }}>
            <Typography
              variant="h6"
              style={{ textAlign: 'center' }}
              gutterBottom
            >
              Ready for Review
            </Typography>
            {loading
              ? 'Loading...'
              : error
              ? JSON.stringify(error)
              : tasks
                  ?.filter((task: Task) => task.clientName === client?.name)
                  .filter((task: Task) => task.status === 'ready_for_review')
                  .map((task: Task) => (
                    <>
                      <Divider />
                      <TaskCard key={task.id} task={task} mode="client" />
                    </>
                  ))}
          </Box>
          <div>
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
                {/* @ts-ignore */}
                <div style={modalStyle} className={classes.paper}>
                  {/* @ts-ignore */}
                  <CloseIcon
                    onClick={handleCloseCreateATask}
                    className={classes.closeIcon}
                  />
                  <CreateATask client={client} />
                </div>
              </Fade>
            </Modal>
          </div>
        </Box>
      </div>
    </>
  );
};

export default KanbanBoard;
