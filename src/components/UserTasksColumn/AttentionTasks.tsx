import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { Task } from '.prisma/client';
import axios from 'axios';

interface OwnProps {
  task: Task;
}
export default function AttentionTasks({ task }: OwnProps) {
  const { user } = useUser();
  const ideLink = 'https://www.duckduckgo.com';
  const devServerLink = 'https://www.xkcd.com';
  const [isShowingMenu, setIsShowingMenu] = useState(false);

  function discordLink(id: String) {
    return `https://discord.com/channels/872949298105552996/${id}`;
  }

  function toggleMenu() {
    setIsShowingMenu(!isShowingMenu);
  }

  function openLinks() {
    window.open(devServerLink, '_blank');
    window.open(ideLink, '_blank');
  }

  async function handleSubmit() {
    const response = await axios.put('/api/tasks/current', {
      task: task,
      name: user?.name ?? 'Freelancer',
      discordChannelId: task.discordChannelId,
    });
    console.log(response);
  }

  return (
    <>
      <div className="relative">
        {isShowingMenu ? (
          <div className="absolute px-3 py-3 z-10 right-2 top-12 -left-20 bg-gray-200 shadow-md rounded">
            <div className="text-left">
              <p className="text-lg">{task.clientName}</p>
              <p className="text-sm">{task.longDesc}</p>
              <div className="mt-6 flex justify-center">
                {/*
                <button
                  //onClick={toggleAbandon}
                  className="button-primary-destructive"
                >
                  Abandon Task
                </button>
								*/}
                <button
                  disabled={true}
                  className="ml-3 button-secondary disabled:hover:bg-white disabled:hover:border-primary-500 disabled:hover:text-primary-700"
                >
                  Request Help
                </button>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
        <div className="border-2 border-red-500 bg-red-50 text-primary-900 shadow p-4 rounded-md max-w-[15rem]">
          <div className="text-left">
            <div className="flex justify-between items-start">
              <h3 className="text-lg capitalize">{task.name}</h3>
              <button onClick={toggleMenu}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-confirmation-100"
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
            <p className="mb-4 text-confirmation-100">${task.price}</p>

            <div className="mb-3">
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
            </div>
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
      </div>
    </>
  );
}
