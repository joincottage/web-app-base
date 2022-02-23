import { Task } from '@prisma/client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { DONE } from 'src/constants/task-stages';

export const usePreviousTasks = () => {
  const [previousTasksLoading, setPreviousTasksLoading] = useState(true);
  const [previousTasksError, setPreviousTasksError] = useState<unknown>(null);
  const [previousTasks, setPreviousTasks] = useState<Task[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/v2/tasks/task-status', {
          params: { taskStatus: DONE },
        });
        const data = await response.data.tasks;
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
