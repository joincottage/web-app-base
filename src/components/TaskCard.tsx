import React, { useContext, useEffect, useState } from 'react';
import { Theme } from '@material-ui/core/styles';
import { makeStyles, createStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Backdrop, Button, Fade, Modal } from '@material-ui/core';
import { Task } from '.prisma/client';
import Chip from '@material-ui/core/Chip';
import CloseIcon from '@material-ui/icons/Close';
import IllDoIt from './IllDoIt';
import { UserProfile, useUser } from '@auth0/nextjs-auth0';
import Axios from 'axios';
import { useSingleTask } from './../hooks/useSingleTask';
import { AppDataContext } from 'src/contexts/AppContext';
import TaskCardSkeleton from './TaskCardSkeleton';
import moment from 'moment';

interface OwnProps {
  task: Task;
  mode: 'freelancer' | 'client';
  showAcceptButton?: boolean;
  showUserImg?: boolean;
  showCompanyLogo?: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      borderRadius: 0,
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

function getModalStyle() {
  return {
    top: `50%`,
    left: `50%`,
    transform: `translate(-50%, -50%)`,
  };
}

export default function TaskCard({
  task,
  mode,
  showAcceptButton,
  showUserImg,
  showCompanyLogo = true,
}: OwnProps) {
  const { user } = useUser();
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [open, setOpen] = useState(false);
  const [modalStyle] = React.useState(getModalStyle);
  const { state, dispatch } = useContext(AppDataContext);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleClickIllDoIt = async () => {
    setOpen(true);
    // sa_event('click_IllDoIt');
  };
  const handleClickAccept = async () => {};
  const handleClose = () => {
    setOpen(false);
  };
  const modalBody = (
    <div style={modalStyle} className={classes.paper}>
      <CloseIcon
        onClick={handleClose}
        className={classes.closeIcon}
        style={{ color: 'white' }}
      />
      <IllDoIt user={user as UserProfile} task={task} />
    </div>
  );

  return (
    <Card className={classes.root}>
      <div className="my-3 flex justify-between mx-4">
        <div>
          <div className="flex items-center">
            {showUserImg && (
              <Avatar
                className="h-6 w-6 ml-1 mr-3"
                alt="User image"
                src={task.userImgUrl || ''}
              />
            )}
            {!showUserImg && !showCompanyLogo && (
              <Avatar className="h-6 w-6 ml-1 mr-3" alt="User image" src={''} />
            )}
            {!showUserImg && showCompanyLogo && (
              <Avatar
                className="h-6 w-6 ml-1 mr-3"
                alt="User image"
                src={task.clientImgUrl || ''}
              />
            )}
            <div className="ml-1">
              <h5 className="font-light">{task.name}</h5>
              <h6 className="text-sm text-gray-500">
                {moment(task.datePosted).format('MMMM Do YYYY')}
              </h6>
            </div>
          </div>
        </div>
        <h6 className="text-green-700 text-xl font-light">${task.price}</h6>
      </div>
      <div className="my-6 mx-4 prose-sm text-gray-500">
        <p>{task.shortDesc}</p>
      </div>
      <div className="flex mx-3 mb-4">
        <div className="flex space-x-2 mr-3 my-1">
          {task.skills?.split(',').map((skill) => (
            <div className="text-sm font-light text-gray-700 bg-gray-200 py-1 px-2 rounded-full">
              {skill}
            </div>
          ))}
        </div>
        {mode === 'freelancer' && (
          <div className={classes.primaryActionsContainer}>
            <Button
              className={classes.ctaButton}
              variant="outlined"
              color="primary"
              onClick={handleExpandClick}
              aria-expanded={expanded}
            >
              Learn more
            </Button>
          </div>
        )}
        <div className={classes.primaryActionsContainer}>
          {showAcceptButton && (
            <button
              onClick={handleClickAccept}
              className="mb-2 mr-2 px-3 py-2 bg-blue-800 disabled:bg-gray-300 disabled:cursor-default hover:bg-blue-700 text-white uppercase text-sm font-light transform ease-in-out duration-500 rounded shadow hover:shadow-md"
            >
              Accept and Pay
            </button>
          )}
        </div>
      </div>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <div className="my-6 mx-4 prose-sm text-gray-500">
          <p>{task.longDesc}</p>
        </div>
        <div className="float-right">
          <div className={classes.primaryActionsContainer}>
            <button
              disabled={state.user.hasCurrentTask}
              onClick={handleClickIllDoIt}
              className="mb-2 mr-2 px-3 py-2 bg-blue-800 disabled:bg-gray-300 disabled:cursor-default hover:bg-blue-700 text-white uppercase text-sm font-light transform ease-in-out duration-500 rounded shadow hover:shadow-md"
            >
              I&apos;ll do it!
            </button>
          </div>
        </div>
      </Collapse>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>{modalBody}</Fade>
      </Modal>
    </Card>
  );
}
