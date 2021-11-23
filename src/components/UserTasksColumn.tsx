import React, { useContext, useEffect, useState } from 'react';
import { UserProfile } from '@auth0/nextjs-auth0';
import TaskEmptyState from './TaskEmptyState';
import CurrentTaskContainer from './CurrentTaskContainer';
import TaskColumnEmptyState from './TaskColumnEmptyState';
import TasksInReview from './TasksInReview';
import TasksInAttention from './TasksInAttention';
import PreviousTasks from './PreviousTasks';
import { useSingleTask } from './../hooks/useSingleTask';
import { useReviewTasks } from './../hooks/useReviewTasks';
import { usePreviousTasks } from './../hooks/usePreviousTasks';
import { Task } from '.prisma/client';
import { AppDataContext } from 'src/contexts/AppContext';

interface OwnProps {
  user: UserProfile;
}

export default function UserTaskColumn({ user }: OwnProps) {
  const { data, loading, error } = useSingleTask();
  const { reviewTasks, reviewLoading, reviewError } = useReviewTasks();
  const { previousTasks, previousLoading, previousError } = usePreviousTasks();
  const { state, dispatch } = useContext(AppDataContext);
  //TODO: Import attention tasks hook

  useEffect(() => {
    //console.log(data);
    if (data !== null && (data as Task[]).length > 0) {
      dispatch({
        type: 'SET_USER',
        payload: { user: { hasCurrentTask: true } },
      });
    }
  }, [data]);

  if (loading) return <TaskColumnEmptyState />;
  return (
    <div className="flex mt-2">
      <div>
        <div className="text-left">
          {true ? (
            <div>
              <p className="my-3 font-semibold text-gray-400">
                Attention Tasks
              </p>
              <TasksInAttention tasks={data as Task[]} />
            </div>
          ) : (
            <div></div>
          )}
          <p className="my-3 font-semibold text-gray-400">Current Task</p>
          {/* @ts-ignore */}
          {data !== null && data.length !== 0 ? (
            <div>
              <CurrentTaskContainer task={data as Task[]} />
            </div>
          ) : (
            <div>
              <TaskEmptyState />
            </div>
          )}

          <p className="mt-6 mb-3 font-semibold text-gray-400">
            Tasks In Review
          </p>
          <TasksInReview tasks={reviewTasks as Task[]} />
          <p className="mt-6 mb-3 font-semibold text-gray-400">
            Previous Tasks
          </p>
          <PreviousTasks tasks={previousTasks as Task[]} />
        </div>
      </div>
    </div>
  );
}
