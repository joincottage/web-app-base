import { Client } from '@prisma/client';
import { useState, useEffect } from 'react';

const useClients = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/v2/clients');
        const data = await response.json();
        setData(data);
        setLoading(false);
      } catch (err) {
        setError(err);
      }
    };

    fetchData();
  }, []);

  return {
    loading,
    error,
    data: data || [],
  };
};

export default useClients;
