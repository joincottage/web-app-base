//import { useState, useEffect } from 'react';
import { Task } from '.prisma/client';
import AttentionTasks from './AttentionTasks';

interface OwnProps {
  tasks: Task[];
}

export default function AttentionTasksContainer({ tasks }: OwnProps) {
  return (
    <div>
      {tasks.map((item, i) => (
        <div className="mb-2" key={i}>
          <AttentionTasks task={item} />
        </div>
      ))}
    </div>
  );
}
