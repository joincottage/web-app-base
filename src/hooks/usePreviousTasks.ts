import { Task } from '@prisma/client';
import { useState, useEffect } from 'react';

export const usePreviousTasks = () => {
  const [previousTasksLoading, setPreviousTasksLoading] = useState(true);
  const [previousTasksError, setPreviousTasksError] = useState(null);
  const [previousTasks, setPreviousTasks] = useState<Task[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/tasks/previous-tasks');
        const data = await response.json();
        setPreviousTasks(data);
        setPreviousTasksLoading(false);
      } catch (err) {
        setPreviousTasksError(err);
      }
    };

    fetchData();
  }, []);

  return { previousTasksLoading, previousTasksError, previousTasks };
};
