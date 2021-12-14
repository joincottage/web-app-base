import {
  Backdrop,
  Box,
  Button,
  Divider,
  Fade,
  Modal,
  Theme,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Client, Task } from '@prisma/client';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import useTasks from 'src/hooks/useTasks';
import useClients from 'src/hooks/useClients';
import CreateATask from '../CreateATask';
import TaskCard from '../TaskList/TaskCard';
import CloseIcon from '@material-ui/icons/Close';
import {
  TASK_QUEUED,
  IN_PROGRESS,
  IN_REVIEW,
  DONE,
} from 'src/constants/task-stages';
import ProgressBar from './ProgressBar';
import { AppDataContext } from 'src/contexts/AppContext';
import ClientToggle from './ClientToggle';
import TaskColumn from './TaskColumn';
import useUserOwnedClient from 'src/hooks/useUserOwnedClient';

function getModalStyle() {
  return {
    top: `50%`,
    left: `50%`,
    transform: `translate(-50%, -50%)`,
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    position: 'absolute',
    width: '740px',
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
}));

const KanbanBoard = () => {
  const router = useRouter();
  const {
    loading,
    error,
    data: { client },
  } = useUserOwnedClient();
  const [isCreateATaskOpen, setIsCreateATaskOpen] = useState(
    router.query.showCreateTask === 'true'
  );

  const { state } = useContext(AppDataContext);

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
      <div style={{ height: '87px' }}>
        {client && <ClientToggle clients={[client]} />}
      </div>
      <div style={{ display: 'flex' }}>
        <Box m={1}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <ProgressBar tasks={client?.tasks} />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              width: '100vw',
            }}
          >
            <div style={{ marginTop: '-65px' }}>
              <Button
                onClick={handleClickCreateATask}
                variant="outlined"
                color="primary"
                size="small"
                style={{
                  height: '50px',
                  marginBottom: '15px',
                }}
              >
                Create a task
              </Button>
              <Fade in={true} timeout={500}>
                <div>
                  <TaskColumn
                    title="Task Queue"
                    tasks={client?.tasks?.filter(
                      (task: Task) =>
                        task.status === TASK_QUEUED || !task.status
                    )}
                    loading={loading}
                    error={error}
                    showCompanyLogos={false}
                    style={{ marginLeft: '15px' }}
                  />
                </div>
              </Fade>
            </div>
            <Fade in={true} timeout={1000}>
              <div>
                <TaskColumn
                  title="In Progress"
                  tasks={client?.tasks?.filter(
                    (task: Task) => task.status === IN_PROGRESS
                  )}
                  loading={loading}
                  error={error}
                  showCompanyLogos={false}
                  showUserImgs={true}
                />
              </div>
            </Fade>
            <Fade in={true} timeout={1500}>
              <div>
                <TaskColumn
                  title="In Review"
                  tasks={client?.tasks?.filter(
                    (task: Task) => task.status === IN_REVIEW
                  )}
                  loading={loading}
                  error={error}
                  showCompanyLogos={false}
                  showUserImgs={true}
                  showAcceptButtons={true}
                />
              </div>
            </Fade>
            <Fade in={true} timeout={2000}>
              <div>
                <TaskColumn
                  title="Done"
                  tasks={client?.tasks?.filter(
                    (task: Task) => task.status === DONE
                  )}
                  loading={loading}
                  error={error}
                  showCompanyLogos={false}
                  showUserImgs={true}
                  style={{ marginRight: '0' }}
                />
              </div>
            </Fade>
          </div>
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
                <div style={modalStyle} className={classes.paper}>
                  <CloseIcon
                    onClick={handleCloseCreateATask}
                    className={classes.closeIcon}
                  />
                  <CreateATask client={state.selectedClient as Client} />
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
