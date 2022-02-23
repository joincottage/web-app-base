import { useUser } from '@auth0/nextjs-auth0';
import { Client } from '@prisma/client';
import { useState, useEffect } from 'react';

interface OwnProps {
  shouldFetchAll?: boolean;
}

const useClients = ({ shouldFetchAll = false }: OwnProps = {}) => {
  const { user, isLoading } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [clients, setClients] = useState<Client[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/clients');
        const data = await response.json();
        if (shouldFetchAll) {
          data.unshift({ name: 'All' });
          setClients(data);
        } else {
          setClients(
            data.filter((d: Client) => d.userEmailOfOwner === user?.email)
          );
        }
        setLoading(false);
      } catch (err) {
        setError(err);
      }
    };

    fetchData();
  }, [user]);

  return {
    loading,
    error,
    clients: clients || [],
    user,
    isLoading: isLoading && loading,
  };
};

export default useClients;
