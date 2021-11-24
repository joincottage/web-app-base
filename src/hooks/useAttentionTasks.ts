import { Task } from '@prisma/client';
import { useState, useEffect } from 'react';

export const useAttentionTasks = () => {
  const [attentionLoading, setLoading] = useState(true);
  const [attentionError, setError] = useState(null);
  const [attentionTasks, setData] = useState<
    Task[] | { message: string } | null
  >(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/tasks/attention-tasks');
        const data = await response.json();
        setData(data);
        setLoading(false);
      } catch (err) {
        setError(err);
      }
    };

    fetchData();
  }, []);

  return { attentionLoading, attentionError, attentionTasks };
};
