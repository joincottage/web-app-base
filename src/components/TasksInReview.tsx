//import { useState, useEffect } from 'react';
import { Task } from '@prisma/client';
import { IN_REVIEW } from 'src/constants/task-stages';

interface OwnProps {
  tasks: Task[];
}

export default function TasksInReview({ tasks }: OwnProps) {
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
      {tasks.map((task) => (
        <div className="my-3 px-3 py-2 rounded bg-primary-50 shadow max-w-[15rem]">
          <div className="flex justify-between my-1">
            <div className="text-left">
              <p className="mb-1">{task.name}</p>
            </div>
          </div>
          <div className="mt-2">
            {task.status == IN_REVIEW ? (
              <p className="bg-gray-50 rounded-md py-1 px-3 text-sm text-center text-yellow-500">
                Waiting&nbsp;Approval
              </p>
            ) : (
              <></>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
