import { User } from '@prisma/client';
import { useState, useEffect } from 'react';
import { useUser as useAuth0User } from '@auth0/nextjs-auth0';

const useClients = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const {
    user: auth0User,
    isLoading: auth0Loading,
    error: auth0Error,
  } = useAuth0User();

  useEffect(() => {
    if (auth0Error) {
      setError(auth0Error);
      setLoading(false);
      return;
    }
    if (!auth0User && !auth0Loading) {
      setLoading(false);
      return;
    }

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

    if (auth0User) {
      fetchData();
    }
  }, [auth0User]);

  return {
    loading,
    error,
    user,
  };
};

export default useClients;
