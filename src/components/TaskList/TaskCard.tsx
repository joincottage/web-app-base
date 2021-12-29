import React, { useContext, useEffect, useState } from 'react';
import { Theme } from '@material-ui/core/styles';
import { makeStyles, createStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import { red } from '@material-ui/core/colors';
import {
  Backdrop,
  Button,
  Chip,
  Fade,
  Modal,
  Typography,
} from '@material-ui/core';
import { Task } from '.prisma/client';
import CloseIcon from '@material-ui/icons/Close';
import IllDoIt from '../IllDoIt';
import { UserProfile, useUser } from '@auth0/nextjs-auth0';
import { AppDataContext } from 'src/contexts/AppContext';
import moment from 'moment';
import Axios from 'axios';
import LoadingSpinner from '../LoadingSpinner';
import BugReportOutlinedIcon from '@material-ui/icons/BugReportOutlined';
import CubeTransparentOutlineIcon from '../icons/CubeTransparentOutlineIcon';
import TaskDetailsModal from './TaskDetailsModal';
import { RequestStatus } from 'src/constants/request-status';
import { convertFromRaw, Editor, EditorState } from 'draft-js';

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
        backgroundColor: 'rgba(219, 234, 254, 0.25)',
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

const renderLongDescription = (task: Task) => {
  let editorState: EditorState;
  try {
    editorState = EditorState.createWithContent(
      convertFromRaw(JSON.parse(task.longDesc as string))
    );
  } catch (err) {
    return task.longDesc;
  }

  // @ts-ignore
  return <Editor editorState={editorState} readOnly />;
};

export default function TaskCard({
  task,
  mode,
  showAcceptButton,
  showUserImg,
  showCompanyLogo = true,
  styles = {},
}: OwnProps) {
  const { user } = useUser();
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [modalStyle] = React.useState(getModalStyle);
  const { state, dispatch } = useContext(AppDataContext);

  const handleClickIllDoIt = () => {};

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
            <Typography variant="subtitle2" className="font-bold" gutterBottom>
              {task.name}
            </Typography>
            <h6 className="my-2 text-sm text-gray-500 flex items-center">
              <Avatar
                className="h-6 w-6"
                alt="User image"
                src={task.clientImgUrl || ''}
                style={{ display: 'inline-block' }}
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
                {/* TODO: This needs to be added to the database schmea*/}
                {/* BUG: This ts-ignore needs to be removed!!*/}
                {/* @ts-ignore */}
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
                  {moment().diff(moment(task.datePosted), 'days')}
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
