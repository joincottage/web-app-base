//import { useState, useEffect } from 'react';
import { Task } from '.prisma/client';
import TasksInAttention from './TasksInAttention';

interface OwnProps {
  tasks: Task[];
}

export default function AttentionTasksContainer({ tasks }: OwnProps) {
  return (
    <div>
      {tasks.map((item) => (
        <div className="mb-2">
          <TasksInAttention task={item} />
        </div>
      ))}
    </div>
  );
}
