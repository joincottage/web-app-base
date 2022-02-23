//import { useState, useEffect } from 'react';
import { Task } from '@prisma/client';
import Typography from '@mui/material/Typography';

interface OwnProps {
  tasks: Task[];
}

export default function ReviewTasks({ tasks }: OwnProps) {
  if (tasks === null || tasks.length === 0) {
    return (
      <div>
        <p className="text-gray-400 text-sm">
          You have no tasks currently in review.
        </p>
      </div>
    );
  }
  return (
    <div className="">
      {tasks.map((task, i) => (
        <div
          className="my-3 px-3 py-2 rounded bg-blue-100 shadow max-w-[15rem]"
          key={i}
        >
          <div className="flex justify-between my-1">
            <div className="text-left">
              <Typography
                variant="subtitle2"
                className="font-bold"
                style={{
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  maxWidth: '216px',
                }}
              >
                {task.name}
              </Typography>
            </div>
          </div>
          <div className="mt-2">
            <Typography
              variant="subtitle2"
              className="bg-gray-50 rounded-md py-1 px-3 text-center text-gray-500"
            >
              Awaiting&nbsp;Approval
            </Typography>
          </div>
        </div>
      ))}
    </div>
  );
}
