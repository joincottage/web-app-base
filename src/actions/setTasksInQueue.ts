import { Task } from '@prisma/client';

export const SET_TASKS_IN_QUEUE = 'SET_TASKS_IN_QUEUE';
export interface SetTasksInQueue {
  type: typeof SET_TASKS_IN_QUEUE;
  payload: {
    tasksInQueue: Task[];
  };
}

const setTasksInQueue = (tasks: Task[]): SetTasksInQueue => ({
  type: SET_TASKS_IN_QUEUE,
  payload: { tasksInQueue: tasks },
});

export default setTasksInQueue;
