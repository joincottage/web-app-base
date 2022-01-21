import { Task } from '.prisma/client';
import { Backdrop, Chip, Fade, Modal, Typography } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import { red } from '@material-ui/core/colors';
import { Theme } from '@material-ui/core/styles';
import BugReportOutlinedIcon from '@material-ui/icons/BugReportOutlined';
import CloseIcon from '@material-ui/icons/Close';
import { createStyles, makeStyles } from '@material-ui/styles';
import moment from 'moment';
import React, { useState } from 'react';
import CubeTransparentOutlineIcon from '../icons/CubeTransparentOutlineIcon';
import TaskDetailsModal from './TaskDetailsModal';

interface OwnProps {
  task: Task;
  mode: 'freelancer' | 'client';
  showAcceptButton?: boolean;
  showUserImg?: boolean;
  showCompanyLogo?: boolean;
  styles?: any;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      borderRadius: 0,
      boxShadow: 'none',
      '&:hover': {
        cursor: 'pointer',
        backgroundColor: 'rgb(247, 250, 254)',
      },
    },
    container: {
      padding: '20px',
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    ctaButton: {},
    primaryActionsContainer: {
      marginLeft: 'auto',
    },
    expand: {
      transform: 'rotate(0deg)',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    avatar: {
      backgroundColor: red[500],
    },
    paper: {
      position: 'absolute',
      width: '400px',
      minHeight: '405px',
      backgroundColor: theme.palette.background.paper,
      borderRadius: '4px',
      padding: theme.spacing(2, 4, 3),
    },
    closeIcon: {
      cursor: 'pointer',
      position: 'absolute',
      right: '15px',
      zIndex: 2,
    },
  })
);

function getModalStyle() {
  return {
    top: `50%`,
    left: `50%`,
    transform: `translate(-50%, -50%)`,
  };
}

export default function TaskCard({
  task,
  showAcceptButton,
  styles = {},
}: OwnProps) {
  const classes = useStyles();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [modalStyle] = React.useState(getModalStyle);

  const handleClickTaskCard = async () => {
    setShowTaskModal(true);
    // sa_event('click_IllDoIt');
  };
  const handleClose = () => {
    setShowTaskModal(false);
  };
  const modalBody = (
    <div>
      <TaskDetailsModal task={task} handleClose={handleClose} />
    </div>
  );
  const handleClosePaymentForm = () => {
    setOpenPaymentModal(false);
  };
  const paymentModalBody = (
    <div style={modalStyle} className={classes.paper}>
      <CloseIcon
        onClick={handleClosePaymentForm}
        className={classes.closeIcon}
      />
      {/* TODO: create task for client payment onboarding */}
      {/* <PaymentForm task={task} /> */}
    </div>
  );

  return (
    <Card className={classes.root} style={styles}>
      <div className={classes.container} onClick={handleClickTaskCard}>
        <div className="flex justify-between">
          <div className="ml-1">
            <Typography
              variant="subtitle2"
              gutterBottom
              style={{ fontWeight: 700 }}
            >
              {task.name}
            </Typography>
            <h6 className="my-2 text-sm text-gray-500 flex items-center">
              <Avatar
                alt="User image"
                src={task.clientImgUrl || ''}
                style={{
                  display: 'inline-block',
                  width: '1.5rem',
                  height: '1.5rem',
                }}
              />
              <span className="ml-2 font-light uppercase">
                {task.clientName}
              </span>
              <span className="ml-2 mr-2">{' - '}</span>
              <Typography variant="body2" className="text-green-700 font-light">
                ${task.price}
              </Typography>
              <span className="ml-2 mr-2">{' - '}</span>
              <span>
                {task.type === 'bug' ? (
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
                    clickable
                    style={{ border: 'none' }}
                    variant="outlined"
                  />
                ) : (
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
                    style={{ border: 'none' }}
                  />
                )}
              </span>
              <span className="mr-2">{' - '}</span>
              <span>
                <Typography variant="body2">
                  {'Posted '}
                  {moment().diff(moment(task.createdAt), 'days')}
                  {' days ago'}
                </Typography>
              </span>
            </h6>
          </div>
        </div>
        <div className="mb-1 prose-sm text-gray-500">
          <Typography variant="body2" gutterBottom>
            {task.shortDesc}
          </Typography>
        </div>
        <div className="flex justify-between">
          <div className="flex space-x-2 mr-3 my-1">
            {!showAcceptButton &&
              task.skills?.split(',').map((skill) => (
                <div
                  className="text-sm font-light text-gray-700 bg-gray-200 py-1 px-2 rounded-full"
                  key={skill}
                >
                  {skill}
                </div>
              ))}
          </div>
        </div>
      </div>
      <Modal
        open={showTaskModal}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={showTaskModal}>{modalBody}</Fade>
      </Modal>
      <Modal
        open={openPaymentModal}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openPaymentModal}>{paymentModalBody}</Fade>
      </Modal>
    </Card>
  );
}
