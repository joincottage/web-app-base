import { useUser } from '@auth0/nextjs-auth0';
import { Client } from '@prisma/client';
import React, { useState, useEffect } from 'react';

const useTasks = () => {
  const { user, isLoading } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [client, setClient] = useState<Client[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/clients');
        const data = await response.json();
        setClient(data.filter((d: Client) => d.userEmailOfOwner === user?.email));
        setLoading(false);
      } catch (err) {
        setError(err);
      }
    };

    fetchData();
  }, [user]);

  return { loading, error, client: client || [], user, isLoading: isLoading && loading };
};

export default useTasks;