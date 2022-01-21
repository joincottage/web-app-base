import {
  Backdrop,
  Box,
  Button,
  Fade,
  Modal,
  Theme,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Client, Task } from '@prisma/client';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import CreateATask from '../CreateATask';
import CloseIcon from '@material-ui/icons/Close';
import CreateIcon from '@material-ui/icons/Create';
import BuildIcon from '@material-ui/icons/Build';
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
    minHeight: '90vh',
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
      <div style={{ display: 'flex', height: '100%' }}>
        <Box style={{ height: '100%' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
            }}
          >
            <div
              style={{
                width: '200px',
                height: '100%',
                background: 'white',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {client && <ClientToggle clients={[client]} />}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <ProgressBar tasks={client?.tasks} />
              </div>
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
                <CreateIcon />
                New task
              </Button>
            </div>
            <div style={{ padding: '24px 0px 0px 36px', display: 'flex' }}>
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
                    style={{ marginRight: '12px' }}
                  />
                </div>
              </Fade>
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
                    style={{ marginRight: '12px' }}
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
                    style={{ marginRight: '12px' }}
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
            {!client && !loading && (
              <Fade in={!client && !loading} timeout={1000}>
                <div
                  style={{
                    position: 'fixed',
                    top: '64px',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backdropFilter: 'blur(2px) grayscale(100%)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      background: 'white',
                      padding: '50px 0',
                      borderRadius: '4px',
                      boxShadow: '0px 0px 40px 40px #FFF',
                    }}
                  >
                    <Typography
                      variant="h5"
                      className="flex justify-center"
                      style={{
                        width: '400px',
                        marginBottom: '20px',
                        fontWeight: 700,
                      }}
                    >
                      Under construction
                    </Typography>
                    <BuildIcon
                      style={{ width: '120px', height: '120px' }}
                      color="primary"
                    />
                    <Typography
                      variant="subtitle1"
                      className="flex justify-center"
                      style={{
                        width: '300px',
                        marginTop: '20px',
                        fontWeight: 700,
                      }}
                    >
                      Reach out to the Cottage team on Discord to start creating
                      tasks
                    </Typography>
                  </div>
                </div>
              </Fade>
            )}
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
                  <CreateATask
                    client={state.selectedClient as Client}
                    task={null}
                  />
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
