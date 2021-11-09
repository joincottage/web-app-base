import { useState, useEffect } from 'react';
import { UserProfile } from '@auth0/nextjs-auth0';
import TaskEmptyState from './TaskEmptyState';
import CurrentTask from './CurrentTask';
import TasksInReview from './TasksInReview';
import PreviousTasks from './PreviousTasks';
import { useSingleTask } from './../hooks/useSingleTask';
import { useReviewTasks } from './../hooks/useReviewTasks';
import { usePreviousTasks } from './../hooks/usePreviousTasks';
import Axios from 'axios';
import { Task } from '.prisma/client';

interface OwnProps {
  user: UserProfile;
}

export default function UserTaskColumn({ user }: OwnProps) {
  const { data, loading, error } = useSingleTask();
  const { reviewTasks, reviewLoading, reviewError } = useReviewTasks();
  const { previousTasks, previousLoading, previousError } = usePreviousTasks();

  useEffect(() => {
    console.log('DATA', data);
    console.log('Previous', previousTasks);
  }, [previousTasks]);

  if (loading) return <div>Loading...</div>;
  return (
    <div className="flex mt-2">
      <div>
        <img
          className="mx-auto rounded-full h-20 w-20"
          src={user.picture || ''}
          alt="User Picture"
        />
        <div className="text-left">
          <p className="my-3 font-semibold text-gray-400">Current Task</p>
          {/* @ts-ignore */}
          {data !== null && data?.message !== 'no task' ? (
            <div>
              <CurrentTask task={data as Task} />
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
