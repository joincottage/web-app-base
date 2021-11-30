//import { useState, useEffect } from "react";
import { Tooltip } from '@material-ui/core';
import { Task } from '.prisma/client';
import useTasksUsername from './../../hooks/useTaskUsername';

interface OwnProps {
  task: Task;
  mode: 'freelancer' | 'client';
  showAcceptButton?: boolean;
  showUserImg?: boolean;
  showCompanyLogo?: boolean;
  styles?: any;
}
export default function KanbanTaskCard({
  task,
  mode,
  showAcceptButton,
  showUserImg,
  showCompanyLogo = true,
  styles = {},
}: OwnProps) {
  const { username, loading, error } = useTasksUsername();

  return (
    <div className="border-2 border-primary-500 rounded-lg my-3 mx-3">
      <div className="text-left px-3 py-2">
        <div className="flex justify-between">
          <h3>{task.name}</h3>

          <Tooltip title={`${task.shortDesc} - $${task.price}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </Tooltip>
        </div>
        {task.userId === null ? (
          <p className="text-xs">Currently In Queue</p>
        ) : (
          <p className="text-xs">{username} has picked up the task.</p>
        )}
      </div>
    </div>
  );
}
