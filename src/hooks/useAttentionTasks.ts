import { Task } from '@prisma/client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { IN_ATTENTION } from 'src/constants/task-stages';

export const useAttentionTasks = () => {
  const [attentionLoading, setLoading] = useState(true);
  const [attentionError, setError] = useState(null);
  const [attentionTasks, setData] = useState<Task[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/v2/tasks/task-status', {
          params: { taskStatus: IN_ATTENTION },
        });
        const data = await response.data.tasks;
        setData(data);
        setLoading(false);
      } catch (err: any) {
        setError(err);
      }
    };

    fetchData();
  }, []);

  return { attentionLoading, attentionError, attentionTasks };
};
