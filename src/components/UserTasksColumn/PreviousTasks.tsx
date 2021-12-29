//import { useState, useEffect } from "react";
import { Task } from '@prisma/client';

interface OwnProps {
  tasks: Task[];
}

export default function PreviousTasks({ tasks }: OwnProps) {
  if (tasks === null || tasks.length === 0)
    return (
      <div>
        <p className="text-gray-400 text-sm">
          Your completed tasks will show here.
        </p>
      </div>
    );
  return (
    <div className="text-left">
      <ul role="list" className="space-y-3">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="bg-gray-50 shadow overflow-hidden rounded-md px-3 py-2 text-gray-500"
          >
            <p
              className=""
              style={{
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                maxWidth: '216px',
              }}
            >
              {task.name}
            </p>
            <p className="text-sm text-primary-800 opacity-60">
              {task.clientName}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
