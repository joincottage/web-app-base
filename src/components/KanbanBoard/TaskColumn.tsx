import { Box } from '@material-ui/core';
import { Task } from '@prisma/client';
import React, { useContext } from 'react';
import { TASK_QUEUED } from 'src/constants/task-stages';
import { AppDataContext } from 'src/contexts/AppContext';
import TaskCard from '../TaskCard';
import CircularProgress from '@material-ui/core/CircularProgress';

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
  const { state } = useContext(AppDataContext);

  return (
    <Box
      style={{
        ...{
          backgroundColor: 'rgb(244, 245, 248)',
          padding: '10px',
          borderRadius: '7px',
          border: '1px solid rgb(217, 222, 227)',
          display: 'relative',
          marginRight: '15px',
        },
        ...style,
      }}
    >
      <div
        style={{
          textAlign: 'left',
          marginBottom: '10px',
        }}
      >
        <span className="text-sm font-bold text-gray-700 bg-gray-200 py-1 px-2 mx-2 rounded-full">
          {tasks?.length}
        </span>
        <span
          style={{
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          {title}
        </span>
      </div>
      <div style={{ overflow: 'scroll', width: '23vw', height: '68vh' }}>
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          JSON.stringify(error)
        ) : (
          tasks?.reverse().map((task: Task) => (
            <div style={{ marginBottom: '10px' }}>
              <TaskCard
                key={task.id}
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
