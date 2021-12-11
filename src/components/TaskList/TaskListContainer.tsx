import React, { useContext } from 'react';
import Typography from '@material-ui/core/Typography';
import { Avatar } from '@material-ui/core';
import TaskList from 'src/components/TaskList';
import { Client } from '.prisma/client';
import { AppDataContext } from '../../contexts/AppContext';

interface OwnProps {}

export default function TaskListContainer({}: OwnProps) {
  const { state, dispatch } = useContext(AppDataContext);
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '15px',
        }}
      >
        <span style={{ marginRight: '15px', height: 80 }}>
          {(state.selectedClient as Client).logoUrl && (
            <Avatar
              sx={{ width: 80, height: 80 }}
              alt="Company logo"
              src={(state.selectedClient as Client).logoUrl as string}
              aria-haspopup="true"
            />
          )}
        </span>
        <Typography variant="h5" style={{ paddingRight: '30px' }}>
          {state.selectedClient.name}
        </Typography>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minWidth: '600px',
          maxWidth: '600px',
          maxHeight: '82vh',
          overflow: 'scroll',
        }}
      >
        <TaskList />
      </div>
    </div>
  );
}
