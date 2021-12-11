import React, { ChangeEvent, useContext, useEffect } from 'react';
import { AppDataContext } from '../../contexts/AppContext';
import TaskCardSkeleton from 'src/components/emptystates/TaskCardEmptyState';
import TaskCard from './TaskCard';
import Divider from '@material-ui/core/Divider';
import { Task } from '@prisma/client';
import useTasks from 'src/hooks/useTasks';
import { TASK_QUEUED } from 'src/constants/task-stages';
import { Fade, InputAdornment } from '@material-ui/core';
import setTasksInQueue from 'src/actions/setTasksInQueue';
import TaskTypeFilter from './TaskTypeFilter';
import { Input } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import setActiveSearchTerm from 'src/actions/setActiveSearchTerm';

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

  const handleSearchTermChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setActiveSearchTerm(e.target.value));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Input
          placeholder="Search skills"
          className=" text-sm font-light text-gray-700 bg-gray-200 py-1 px-2 rounded-full"
          style={{ height: '32px', width: '200px' }}
          disableUnderline
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
          onChange={handleSearchTermChange}
        />
        <TaskTypeFilter />
      </div>
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
                (t.skills as string).indexOf(state.activeSearchTerm) > -1
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
                (t.skills as string).indexOf(state.activeSearchTerm) > -1
              : true
          )
          .filter((task: Task) => task.clientName === state.selectedClient.name)
          .map((task: Task, i) => (
            <TaskListItemContainer task={task} index={i} />
          ))
      )}
    </div>
  );
}
