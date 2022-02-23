import { Task } from '@prisma/client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { IN_REVIEW } from 'src/constants/task-stages';

export const useReviewTasks = () => {
  const [reviewTasksLoading, setReviewTasksLoading] = useState(true);
  const [reviewTasksError, setReviewTasksError] = useState<unknown>(null);
  const [reviewTasks, setReviewTasks] = useState<Task[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/v2/tasks/task-status', {
          params: { taskStatus: IN_REVIEW },
        });
        const data = await response.data.tasks;
        setReviewTasks(data);
        setReviewTasksLoading(false);
      } catch (err) {
        setReviewTasksError(err);
      }
    };

    fetchData();
  }, []);

  return { reviewTasksLoading, reviewTasksError, reviewTasks };
};
