import { Task } from '.prisma/client';
import { UserProfile } from '@auth0/nextjs-auth0';
import { Fade, Tooltip, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { createStyles, makeStyles } from '@mui/styles';
import React, { useContext, useEffect, useState } from 'react';
import setCurrentTask from 'src/actions/setCurrentTask';
import setPreviousTasks from 'src/actions/setPreviousTasks';
import setTasksInReview from 'src/actions/setTasksInReview';
import { AppDataContext } from 'src/contexts/AppContext';
import { useAttentionTasks } from '../../hooks/useAttentionTasks';
import { useCurrentTask } from '../../hooks/useCurrentTask';
import { usePreviousTasks } from '../../hooks/usePreviousTasks';
import { useReviewTasks } from '../../hooks/useReviewTasks';
import TaskColumnEmptyState from '../emptystates/TaskColumnEmptyState';
import TaskEmptyState from '../emptystates/TaskEmptyState';
import AttentionTasksContainer from './AttentionTasksContainer';
import CurrentTaskContainer from './CurrentTaskContainer';
import PreviousTasks from './PreviousTasks';
import ReviewTasks from './ReviewTasks';

const ANIMATION_TIMEOUT_MILLIS = 500;

interface OwnProps {
  user: UserProfile | undefined;
}

const useStyles = makeStyles(() =>
  createStyles({
    title: {
      fontWeight: 600,
    },
  })
);

export default function UserTaskColumn({ user }: OwnProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentTask, currentTaskLoading, currentTaskError } =
    useCurrentTask();
  const { reviewTasks, reviewTasksLoading, reviewTasksError } =
    useReviewTasks();
  const { previousTasks, previousTasksLoading, previousTasksError } =
    usePreviousTasks();
  const { attentionTasks } = useAttentionTasks();
  const { state, dispatch } = useContext(AppDataContext);
  const classes = useStyles();

  // TODO: load and dispatch all state data in a single place that isn't a component
  useEffect(() => {
    if (!currentTaskLoading && !reviewTasksLoading && !previousTasksLoading) {
      setLoading(false);
      dispatch(setCurrentTask(currentTask));
      dispatch(setTasksInReview(reviewTasks as Task[]));
      dispatch(setPreviousTasks(previousTasks as Task[]));
    }
    if (currentTaskError || reviewTasksError || previousTasksError) {
      setLoading(false);
      setError(
        JSON.stringify(
          { currentTaskError, reviewTasksError, previousTasksError },
          null,
          2
        )
      );
    }
  }, [
    currentTaskLoading,
    reviewTasksLoading,
    previousTasksLoading,
    currentTaskError,
    reviewTasksError,
    previousTasksError,
  ]);

  return (
    <div style={{ position: 'relative' }}>
      <Fade in={loading || !user} timeout={ANIMATION_TIMEOUT_MILLIS}>
        <div>
          <TaskColumnEmptyState />
        </div>
      </Fade>
      <Fade in={!!error} timeout={ANIMATION_TIMEOUT_MILLIS}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <div style={{ opacity: 0.5 }}>
            <TaskColumnEmptyState />
          </div>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Tooltip title={error as string}>
              <ErrorOutlineIcon
                color="primary"
                style={{ width: '80px', height: '80px' }}
              />
            </Tooltip>
          </div>
        </div>
      </Fade>
      <Fade in={!loading && !error} timeout={ANIMATION_TIMEOUT_MILLIS}>
        <div
          className="flex mt-2"
          style={{ position: 'absolute', top: '-8px' }}
        >
          <div>
            <div className="text-left">
              {attentionTasks && attentionTasks.length !== 0 ? (
                <div>
                  <p className="my-3 font-semibold">Attention Tasks</p>
                  <AttentionTasksContainer tasks={attentionTasks as Task[]} />
                </div>
              ) : (
                <div></div>
              )}
              <Typography
                variant="subtitle1"
                gutterBottom
                className={classes.title}
              >
                Your Current Task
              </Typography>
              {state.currentTask !== null ? (
                <div>
                  <CurrentTaskContainer task={state.currentTask as Task} />
                </div>
              ) : (
                <div>
                  <TaskEmptyState />
                </div>
              )}

              <Typography
                variant="subtitle1"
                gutterBottom
                className={classes.title}
                style={{ marginTop: '1.5rem' }}
              >
                Your Tasks In Review
              </Typography>
              <ReviewTasks tasks={state.tasksInReview as Task[]} />
              <Typography
                variant="subtitle1"
                gutterBottom
                className={classes.title}
                style={{ marginTop: '1.5rem' }}
              >
                Your Completed Tasks
              </Typography>
              <PreviousTasks tasks={state.previousTasks as Task[]} />
            </div>
          </div>
        </div>
      </Fade>
    </div>
  );
}
