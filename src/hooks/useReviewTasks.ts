import { Task } from '@prisma/client';
import { useState, useEffect } from 'react';

export const useReviewTasks = () => {
  const [reviewTasksLoading, setReviewTasksLoading] = useState(true);
  const [reviewTasksError, setReviewTasksError] = useState(null);
  const [reviewTasks, setReviewTasks] = useState<Task[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/tasks/review-tasks');
        const data = await response.json();
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
