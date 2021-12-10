import { Task } from '@prisma/client';

export const SET_TASKS_IN_REVIEW = 'SET_TASKS_IN_REVIEW';
export interface SetTasksInReviewAction {
  type: typeof SET_TASKS_IN_REVIEW;
  payload: {
    tasksInReview: Task[];
  };
}

const setTasksInReview = (tasks: Task[]): SetTasksInReviewAction => ({
  type: SET_TASKS_IN_REVIEW,
  payload: { tasksInReview: tasks },
});

export default setTasksInReview;
