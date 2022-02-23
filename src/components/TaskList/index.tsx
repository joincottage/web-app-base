import { Fade } from '@mui/material';
import Divider from '@mui/material/Divider';
import { Task } from '@prisma/client';
import times from 'lodash/times';
import React, { useContext, useEffect } from 'react';
import setTasksInQueue from 'src/actions/setTasksInQueue';
import TaskCardSkeleton from 'src/components/emptystates/TaskCardEmptyState';
import { TASK_QUEUED } from 'src/constants/task-stages';
import useTasks from 'src/hooks/useTasks';
import { AppDataContext } from '../../contexts/AppContext';
import TaskCard from './TaskCard';
import TaskListContainer from './TaskListContainer';

const EmptyTaskCard = () => (
  <div
    className="border border-dotted border-gray-300"
    style={{
      width: '800px',
      height: '162px',
      background: 'rgba(216, 217, 219, .25)',
    }}
  ></div>
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

export default function TaskList() {
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

  const allAvailableTasks = state.tasksInQueue
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
    .reverse();

  const clientSpecificAvailableTasks = state.tasksInQueue
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
    .filter((task: Task) => task.clientName === state.selectedClient.name);

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
          allAvailableTasks
            .map((task: Task, i) => (
              <TaskListItemContainer task={task} index={i} key={i} />
            ))
            .concat(
              times(19 - allAvailableTasks.length, () => <EmptyTaskCard />)
            )
        ) : (
          clientSpecificAvailableTasks
            .map((task: Task, i) => (
              <TaskListItemContainer task={task} index={i} key={i} />
            ))
            .concat(
              times(19 - clientSpecificAvailableTasks.length, () => (
                <EmptyTaskCard />
              ))
            )
        )}
      </div>
    </TaskListContainer>
  );
}
