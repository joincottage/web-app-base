//import { useState, useEffect } from 'react';
import { Task } from '@prisma/client';
import { IN_REVIEW } from 'src/constants/task-stages';

interface OwnProps {
  tasks: Task[];
}

export default function TasksInReview({ tasks }: OwnProps) {
  function discordLink(id: String) {
    return `https://discord.com/channels/872949298105552996/${id}`;
  }

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
        <div className="my-3 px-3 py-2 rounded bg-blue-50 shadow max-w-[15rem]">
          <div className="flex justify-between my-1">
            <div className="text-left">
              <p className="mb-1">{task.name}</p>
            </div>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
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
            {task.status == 'is_approved' ? (
              <p className="bg-gray-50 rounded-md py-1 px-3 text-sm text-center text-green-500">
                Task&nbsp;Approved
              </p>
            ) : (
              <></>
            )}
            {task.status == 'in_attention' ? (
              <div>
                <p className="bg-gray-50 rounded-md py-1 px-3 text-sm text-center text-red-500">
                  Needs&nbsp;Attention
                </p>
              </div>
            ) : (
              <></>
            )}
          </div>
          {task.status == 'in_attention' ? (
            <>
              <span className="relative w-full inline-flex rounded-md shadow-sm mt-3">
                <a
                  href={discordLink(task.discordChannelId as string)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full border-2 border-red-500 bg-white hover:bg-red-50 transform duration-500 ease-in-out font-bold text-red-500 rounded-md leading-8 text-center "
                >
                  View Issues
                </a>
                <span className="flex absolute h-4 w-4 top-0 right-0 -mt-1.5 -mr-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-95"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                </span>
              </span>
            </>
          ) : (
            <></>
          )}
        </div>
      ))}
    </div>
  );
}
