import { Theme, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Task } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import {
  TASK_QUEUED,
  IN_PROGRESS,
  IN_REVIEW,
  DONE,
} from 'src/constants/task-stages';

interface OwnProps {
  tasks: Task[] | null;
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
  miniBar: {
    height: '0.75rem',
    borderRadius: '6px',
    position: 'relative',
    width: '100%',
    marginRight: '0.5rem',
    overflow: 'hidden',
    backgroundColor: 'rgb(216, 222, 228)',
  },
  miniBarProgress: {
    height: '100%',
    position: 'absolute',
    top: '0rem',
    left: '0rem',
  },
}));

export default function ProgressBar({ tasks }: OwnProps) {
  const classes = useStyles();

  const [tasksQueued, setTasksQueued] = useState<Task[]>([]);
  const [tasksInProgress, setTasksInProgress] = useState<Task[]>([]);
  const [tasksInReview, setTasksInReview] = useState<Task[]>([]);
  const [tasksDone, setTasksDone] = useState<Task[]>([]);

  useEffect(() => {
    setTasksQueued(
      (tasks || []).filter((task: Task) => task.status === TASK_QUEUED)
    );
    setTasksInProgress(
      (tasks || []).filter((task: Task) => task.status === IN_PROGRESS)
    );
    setTasksInReview(
      (tasks || []).filter((task: Task) => task.status === IN_REVIEW)
    );
    setTasksDone((tasks || []).filter((task: Task) => task.status === DONE));
  }, [tasks]);

  return (
    <div style={{ width: '150px', margin: '25px' }}>
      <Tooltip
        title={`${tasksQueued.length} queued / ${
          tasksInProgress.length + tasksInReview.length
        } in progress / ${tasksDone.length} done`}
      >
        <div className={classes.miniBar}>
          {tasks && (
            <div
              className={classes.miniBarProgress}
              style={{
                left: 0,
                width: `${(tasksDone.length / tasks.length) * 100}%`,
                backgroundColor: 'rgb(45, 164, 78)',
              }}
            ></div>
          )}
          {tasks && (
            <div
              className={classes.miniBarProgress}
              style={{
                left: `${(tasksDone.length / tasks.length) * 100}%`,
                width: `${
                  ((tasksInProgress.length + tasksInReview.length) /
                    tasks.length) *
                  100
                }%`,
                backgroundColor: 'rgb(130, 80, 223)',
              }}
            ></div>
          )}
        </div>
      </Tooltip>
    </div>
  );
}
