import { User } from '@prisma/client';
import { useState, useEffect } from 'react';

const useClients = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/v2/users');
        const data = await response.json();
        setUser(data);
        setLoading(false);
      } catch (err) {
        setError(err as any);
      }
    };

    fetchData();
  }, []);

  return {
    loading,
    error,
    user,
  };
};

export default useClients;
