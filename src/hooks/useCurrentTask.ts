import { Task } from '@prisma/client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { IN_PROGRESS } from 'src/constants/task-stages';

function isEmpty(obj: Record<any, any>) {
  return Object.keys(obj).length === 0;
}

export const useCurrentTask = () => {
  const [currentTaskLoading, setCurrentTaskLoading] = useState(true);
  const [currentTaskError, setCurrentTaskError] = useState(null);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/v2/tasks/task-status', {
          params: { taskStatus: IN_PROGRESS },
        });
        const data = await response.data.tasks;

        setCurrentTask(isEmpty(data) ? null : data[0]);
        setCurrentTaskLoading(false);
      } catch (err: any) {
        // FIXME: response.json() fails when a user doesn't have a current task since the response body is empty
        setCurrentTask(null);
        setCurrentTaskError(err);
      }
    };

    fetchData();
  }, []);

  return { currentTaskLoading, currentTaskError, currentTask };
};
