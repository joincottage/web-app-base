//import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { Task } from '.prisma/client';
import axios from 'axios';

interface OwnProps {
  tasks: Task[];
}
export default function TasksInAttention({ tasks }: OwnProps) {
  const { user } = useUser();
  const ideLink = 'https://www.duckduckgo.com';
  const devServerLink = 'https://www.xkcd.com';

  function toggleMenu() {
    //setIsShowingMenu(!isShowingMenu);
  }

  function openLinks() {
    window.open(devServerLink, '_blank');
    window.open(ideLink, '_blank');
  }

  async function handleSubmit() {
    /*
		const response = await axios.put('/api/tasks/current', {
			task: task,
			name: user?.name ?? 'Freelancer',
			discordChannelId: task.discordChannelId,
		});
		console.log(response);
		*/
  }

  return (
    <>
      {tasks.map((task) => (
        <div className="bg-blue-100 text-blue-900 shadow p-4 rounded-md max-w-[15rem]">
          <div className="text-left">
            <div className="flex justify-between items-start">
              <h3 className="text-lg capitalize">{task.name}</h3>
              <button onClick={toggleMenu}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-400 ml-6"
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
              </button>
            </div>
            <p className="mb-4 text-green-800">${task.price}</p>
            <button className="mb-3 button-primary w-full" onClick={openLinks}>
              Open IDE
            </button>
            <button
              className="button-secondary w-full leading-7"
              onClick={handleSubmit}
            >
              Submit For Review
            </button>
          </div>
        </div>
      ))}
    </>
  );
}
