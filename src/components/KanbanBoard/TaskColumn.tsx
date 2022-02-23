import { Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { Task } from '@prisma/client';
import React from 'react';
import KanbanTaskCard from './KanbanTaskCard';

interface OwnProps {
  title: string;
  tasks: Task[] | undefined;
  loading: boolean;
  error: any;
  showCompanyLogos?: boolean;
  showUserImgs?: boolean;
  showAcceptButtons?: boolean;
  style?: any;
}

const LoadingSpinner = () => (
  <div>
    <CircularProgress style={{ width: '30px', height: '30px' }} />
  </div>
);

export default function TaskColumn({
  title,
  tasks,
  loading,
  error,
  showCompanyLogos,
  showUserImgs,
  showAcceptButtons,
  style = {},
}: OwnProps) {
  return (
    <Box
      style={{
        ...{
          padding: 0,
          display: 'relative',
          width: '358px',
        },
        ...style,
      }}
    >
      <div
        style={{
          textAlign: 'left',
          paddingBottom: '20px',
          maxHeight: '100%',
        }}
      >
        <span
          style={{
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          {title}
        </span>
        <span className="text-sm text-gray-700 py-1 px-2 mx-2">
          {tasks?.length}
        </span>
      </div>
      <div style={{ overflow: 'scroll', height: 'calc(100vh - 132px)' }}>
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          JSON.stringify(error)
        ) : (
          tasks?.reverse().map((task: Task) => (
            <div style={{ marginBottom: '8px' }} key={task.id}>
              <KanbanTaskCard
                task={task}
                mode="client"
                showUserImg={showUserImgs}
                showAcceptButton={showAcceptButtons}
                showCompanyLogo={showCompanyLogos}
                styles={{
                  borderRadius: '7px',
                  border: '1px solid rgb(217, 222, 227)',
                }}
              />
            </div>
          ))
        )}
      </div>
    </Box>
  );
}
