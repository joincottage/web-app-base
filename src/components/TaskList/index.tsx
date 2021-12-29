import React, { useContext, useEffect } from 'react';
import { AppDataContext } from '../../contexts/AppContext';
import TaskCardSkeleton from 'src/components/emptystates/TaskCardEmptyState';
import TaskCard from './TaskCard';
import Divider from '@material-ui/core/Divider';
import { Task } from '@prisma/client';
import useTasks from 'src/hooks/useTasks';
import { TASK_QUEUED } from 'src/constants/task-stages';
import { Fade, Typography } from '@material-ui/core';
import setTasksInQueue from 'src/actions/setTasksInQueue';
import TaskListContainer from './TaskListContainer';
import Image from 'next/image';

interface OwnProps {
  //DESTRUCTUREDPROP: [];
}

const EmptyTaskList = () => (
  <div
    style={{
      background: 'none',
      position: 'absolute',
      top: '150px',
      width: '100%',
    }}
  >
    <div className="w-[100%] flex justify-center text-gray-400 font-bold ml-4 mb-4">
      <Image
        src="/no-task.png"
        alt="Sleeping clipboard"
        width={128}
        height={128}
      />
    </div>
    <Typography
      variant="h6"
      className="flex justify-center text-gray-400"
      style={{ fontWeight: 700 }}
    >
      No tasks available
    </Typography>
  </div>
);

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
  const { state, dispatch } = useContext(AppDataContext);

  useEffect(() => {
    if (data) {
      dispatch(
        setTasksInQueue(
          data.filter(
            (task: Task) => task.status === TASK_QUEUED && task.price !== null
          )
        )
      );
    }
  }, [data]);

  return (
    <TaskListContainer>
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
          <div className="text-red">
            Oops! We have experienced an unrecoverable error. All errors are
            monitored and our team is on it!
          </div>
        ) : state.selectedClient.name === 'All' ? (
          state.tasksInQueue
            .filter(
              (t) =>
                state.activeFilters.length === 0 ||
                state.activeFilters.includes(t.type as string)
            )
            .filter((t) =>
              state.activeSearchTerm !== ''
                ? t !== null &&
                  (t.skills as string)
                    .toLowerCase()
                    .indexOf(state.activeSearchTerm.toLowerCase()) > -1
                : true
            )
            .reverse()
            .map((task: Task, i) => (
              <TaskListItemContainer task={task} index={i} />
            ))
        ) : (
          state.tasksInQueue
            .filter(
              (t) =>
                state.activeFilters.length === 0 ||
                state.activeFilters.includes(t.type as string)
            )
            .filter((t) =>
              state.activeSearchTerm !== ''
                ? t !== null &&
                  (t.skills as string)
                    .toLowerCase()
                    .indexOf(state.activeSearchTerm.toLowerCase()) > -1
                : true
            )
            .filter(
              (task: Task) => task.clientName === state.selectedClient.name
            )
            .map((task: Task, i) => (
              <TaskListItemContainer task={task} index={i} />
            ))
        )}
        {!loading &&
          state.selectedClient.name !== 'All' &&
          state.tasksInQueue.filter(
            (task: Task) => task.clientName === state.selectedClient.name
          ).length === 0 && <EmptyTaskList />}
      </div>
    </TaskListContainer>
  );
}
