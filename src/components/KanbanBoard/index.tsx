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
import TaskCard from '../TaskCard';
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
}));

const KanbanBoard = () => {
  const router = useRouter();
  const { loading, error, data: tasks } = useTasks();
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
      <ClientToggle />
      <div style={{ display: 'flex' }}>
        <Box m={1}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <ProgressBar
              tasks={tasks}
              client={state.selectedClient as Client}
            />
          </div>
          <div style={{ display: 'flex', width: '100vw' }}>
            <div style={{ marginTop: '-50px' }}>
              <Button
                onClick={handleClickCreateATask}
                variant="outlined"
                color="primary"
                size="small"
                style={{
                  height: '50px',
                }}
              >
                Create a task
              </Button>
              <Box
                m={2}
                style={{
                  flexBasis: '33%',
                  backgroundColor: 'rgb(244, 245, 248)',
                  padding: '10px',
                  borderRadius: '7px',
                  border: '1px solid rgb(217, 222, 227)',
                }}
              >
                <div
                  style={{
                    textAlign: 'left',
                    marginBottom: '10px',
                  }}
                >
                  <span className="text-sm font-bold text-gray-700 bg-gray-200 py-1 px-2 mx-2 rounded-full">
                    {
                      tasks
                        ?.filter(
                          (task: Task) =>
                            task.clientName === state.selectedClient?.name
                        )
                        .filter((task: Task) => task.status === TASK_QUEUED)
                        .length
                    }
                  </span>
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                    }}
                  >
                    Task Queue
                  </span>
                </div>
                {loading
                  ? 'Loading...'
                  : error
                  ? JSON.stringify(error)
                  : tasks
                      ?.filter(
                        (task: Task) =>
                          task.clientName === state.selectedClient?.name
                      )
                      .filter(
                        (task: Task) =>
                          task.status === TASK_QUEUED || !task.status
                      )
                      .reverse()
                      .map((task: Task) => (
                        <div style={{ marginBottom: '10px' }}>
                          <TaskCard
                            key={task.id}
                            task={task}
                            mode="client"
                            showCompanyLogo={false}
                          />
                        </div>
                      ))}
              </Box>
            </div>
            <Box
              m={2}
              style={{
                flexBasis: '33%',
                backgroundColor: 'rgb(244, 245, 248)',
                padding: '10px',
                borderRadius: '7px',
                border: '1px solid rgb(217, 222, 227)',
              }}
            >
              <div
                style={{
                  textAlign: 'left',
                  marginBottom: '10px',
                }}
              >
                <span className="text-sm font-bold text-gray-700 bg-gray-200 py-1 px-2 mx-2 rounded-full">
                  {
                    tasks
                      ?.filter(
                        (task: Task) =>
                          task.clientName === state.selectedClient?.name
                      )
                      .filter((task: Task) => task.status === IN_PROGRESS)
                      .length
                  }
                </span>
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                  }}
                >
                  In Progress
                </span>
              </div>
              {loading
                ? 'Loading...'
                : error
                ? JSON.stringify(error)
                : tasks
                    ?.filter(
                      (task: Task) =>
                        task.clientName === state.selectedClient?.name
                    )
                    .filter((task: Task) => task.status === IN_PROGRESS)
                    .map((task: Task) => (
                      <>
                        <Divider />
                        <TaskCard
                          key={task.id}
                          task={task}
                          mode="client"
                          showUserImg={true}
                        />
                      </>
                    ))}
            </Box>
            <Box
              m={2}
              style={{
                flexBasis: '33%',
                backgroundColor: 'rgb(244, 245, 248)',
                padding: '10px',
                borderRadius: '7px',
                border: '1px solid rgb(217, 222, 227)',
              }}
            >
              <div
                style={{
                  textAlign: 'left',
                  marginBottom: '10px',
                }}
              >
                <span className="text-sm font-bold text-gray-700 bg-gray-200 py-1 px-2 mx-2 rounded-full">
                  {
                    tasks
                      ?.filter(
                        (task: Task) =>
                          task.clientName === state.selectedClient?.name
                      )
                      .filter((task: Task) => task.status === IN_REVIEW).length
                  }
                </span>
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                  }}
                >
                  Ready for Review
                </span>
              </div>
              {loading
                ? 'Loading...'
                : error
                ? JSON.stringify(error)
                : tasks
                    ?.filter(
                      (task: Task) =>
                        task.clientName === state.selectedClient?.name
                    )
                    .filter((task: Task) => task.status === IN_REVIEW)
                    .map((task: Task) => (
                      <>
                        <Divider />
                        <TaskCard
                          key={task.id}
                          task={task}
                          mode="client"
                          showAcceptButton={true}
                          showUserImg={true}
                        />
                      </>
                    ))}
            </Box>
            <Box
              m={2}
              style={{
                flexBasis: '33%',
                backgroundColor: 'rgb(244, 245, 248)',
                padding: '10px',
                borderRadius: '7px',
                border: '1px solid rgb(217, 222, 227)',
              }}
            >
              <div
                style={{
                  textAlign: 'left',
                  marginBottom: '10px',
                }}
              >
                <span className="text-sm font-bold text-gray-700 bg-gray-200 py-1 px-2 mx-2 rounded-full">
                  {
                    tasks
                      ?.filter(
                        (task: Task) =>
                          task.clientName === state.selectedClient?.name
                      )
                      .filter((task: Task) => task.status === DONE).length
                  }
                </span>
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                  }}
                >
                  Done
                </span>
              </div>
            </Box>
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
