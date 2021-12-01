import React, { useContext } from 'react';
import { AppDataContext } from '../contexts/AppContext';
import TaskCardSkeleton from 'src/components/TaskCardSkeleton';
import TaskCard from '../components/TaskCard';
import Divider from '@material-ui/core/Divider';
import { Task } from '@prisma/client';
import useTasks from 'src/hooks/useTasks';
import { TASK_QUEUED } from 'src/constants/task-stages';
import { Fade } from '@material-ui/core';

interface OwnProps {
  //DESTRUCTUREDPROP: [];
}

const TaskListItemContainer = ({
  task,
  index,
}: {
  task: Task;
  index: number;
}) => (
  <Fade in={true} timeout={(index + 1) * 500}>
    <div>
      <Divider />
      <TaskCard key={task.id} task={task} mode="freelancer" />
    </div>
  </Fade>
);

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
      ) : state.selectedClient.name === 'All' ? (
        data
          ?.filter(
            (task: Task) => task.status === TASK_QUEUED && task.price !== null
          )
          .reverse()
          .map((task: Task, i) => (
            <TaskListItemContainer task={task} index={i} />
          ))
      ) : (
        data
          ?.filter(
            (task: Task) =>
              task.clientName === state.selectedClient.name &&
              task.status === TASK_QUEUED &&
              task.price !== null
          )
          .map((task: Task, i) => (
            <TaskListItemContainer task={task} index={i} />
          ))
      )}
    </div>
  );
}
