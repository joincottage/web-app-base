import React, { useContext } from 'react';
import { AppDataContext } from '../contexts/AppContext';
import TaskCardSkeleton from 'src/components/TaskCardSkeleton';
import TaskCard from '../components/TaskCard';
import Divider from '@material-ui/core/Divider';
import { Task } from '@prisma/client';
import useTasks from 'src/hooks/useTasks';
import { TASK_QUEUED } from 'src/constants/task-stages';

interface OwnProps {
  //DESTRUCTUREDPROP: [];
}

export default function TaskList({}: OwnProps) {
  const { loading, error, data } = useTasks();
  const { state } = useContext(AppDataContext);

  return (
    <div>
      {loading ? (
        <div>
          <TaskCardSkeleton />
          <TaskCardSkeleton />
          <TaskCardSkeleton />
          <TaskCardSkeleton />
          <TaskCardSkeleton />
        </div>
      ) : error ? (
        JSON.stringify(error)
      ) : state.client.name === 'All' ? (
        data
          ?.filter(
            (task: Task) => task.status === TASK_QUEUED && task.price !== null
          )
          .map((task: Task) => (
            <>
              <Divider />
              <TaskCard key={task.id} task={task} mode="freelancer" />
            </>
          ))
      ) : (
        data
          ?.filter(
            (task: Task) =>
              task.clientName === state.client.name &&
              task.status === TASK_QUEUED &&
              task.price !== null
          )
          .map((task: Task) => (
            <>
              <Divider />
              <TaskCard key={task.id} task={task} mode="freelancer" />
            </>
          ))
      )}
    </div>
  );
}
