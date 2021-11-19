import { Task } from '@prisma/client';
import { useState, useEffect } from 'react';

export const usePreviousTasks = () => {
  const [previousLoading, setLoading] = useState(true);
  const [previousError, setError] = useState(null);
  const [previousTasks, setData] = useState<
    Task[] | { message: string } | null
  >(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/tasks/previous-tasks');
        const data = await response.json();
        setData(data);
        setLoading(false);
      } catch (err) {
        setError(err);
      }
    };

    fetchData();
  }, []);

  return { previousLoading, previousError, previousTasks };
};
