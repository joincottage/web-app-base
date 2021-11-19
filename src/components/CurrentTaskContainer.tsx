//import { useState, useEffect } from 'react';
import { Task } from '.prisma/client';
import CurrentTask from './CurrentTask';

interface OwnProps {
  task: Task[];
}

export default function CurrentTaskContainer({ task }: OwnProps) {
  return (
    <div>
      {task.map((item) => (
        <div className="mb-2">
          <CurrentTask task={item} />
        </div>
      ))}
    </div>
  );
}
