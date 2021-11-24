import React, { useState, useEffect } from 'react';

const useTasksUsername = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/tasks/task-username');
        const data = await response.json();
        setUsername(data.name);
        setLoading(false);
      } catch (err) {
        setError(err);
      }
    };

    fetchData();
  }, []);

  return { loading, error, username };
};

export default useTasksUsername;
