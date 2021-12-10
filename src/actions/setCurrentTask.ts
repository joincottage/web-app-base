import { Task } from '@prisma/client';

export const SET_CURRENT_TASK = 'SET_CURRENT_TASK';
export interface SetCurrentTaskAction {
  type: typeof SET_CURRENT_TASK;
  payload: {
    currentTask: Task | null;
  };
}

const setCurrentTask = (task: Task | null): SetCurrentTaskAction => ({
  type: SET_CURRENT_TASK,
  payload: { currentTask: task },
});

export default setCurrentTask;
