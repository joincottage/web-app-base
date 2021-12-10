import { Task } from '@prisma/client';

export const SET_PREVIOUS_TASKS = 'SET_PREVIOUS_TASKS';
export interface SetPreviousTasksAction {
  type: typeof SET_PREVIOUS_TASKS;
  payload: {
    previousTasks: Task[];
  };
}

const setPreviousTasks = (tasks: Task[]): SetPreviousTasksAction => ({
  type: SET_PREVIOUS_TASKS,
  payload: { previousTasks: tasks },
});

export default setPreviousTasks;
