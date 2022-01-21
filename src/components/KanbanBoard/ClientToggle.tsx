import { Avatar, Typography } from '@material-ui/core';
import { Client } from '@prisma/client';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import { AppDataContext } from 'src/contexts/AppContext';
import useLocalStorage from 'src/hooks/useLocalStorage';
import setSelectedClientAction from 'src/actions/setSelectedClient';

interface OwnProps {
  clients: Client[] | null;
}

export default function ClientToggle({ clients }: OwnProps) {
  const router = useRouter();
  const [selectedClient, setSelectedClient] = useLocalStorage(
    'selectedClient',
    ''
  );
  const { dispatch } = useContext(AppDataContext);

  useEffect(() => {
    const selectedClientFromRouterQuery =
      clients?.find((c) => c.name === router.query.selectedClientName) ||
      selectedClient;
    setSelectedClient(selectedClientFromRouterQuery);
    dispatch(setSelectedClientAction(selectedClientFromRouterQuery));
  }, [router.query]);

  const handleClickClientButton = (client: Client) => {
    setSelectedClient(client);
    dispatch(setSelectedClientAction(client));
  };

  return (
    <div style={{ display: 'flex', minHeight: '87px' }}>
      {clients?.map((c) => (
        <div
          key={c.name}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '15px',
            marginRight: '10px',
            marginLeft: '10px',
            opacity: selectedClient?.id === c.id ? 1 : 0.5,
            transform:
              selectedClient?.id === c.id ? 'scale(1.0)' : 'scale(0.6)',
            cursor: 'pointer',
          }}
          onClick={handleClickClientButton.bind(null, c)}
        >
          <Avatar
            alt="Account"
            src={c?.logoUrl || ''}
            aria-haspopup="true"
            style={{
              width: '40px',
              height: '40px',
              marginRight: '8px',
            }}
          />
          <Typography variant="h6">{c.name}</Typography>
        </div>
      ))}
    </div>
  );
}
