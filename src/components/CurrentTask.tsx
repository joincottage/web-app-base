import { useContext, useState, useEffect } from 'react';
import { AppDataContext } from '../contexts/AppContext';
import { Task } from '.prisma/client';
import axios from 'axios';
import { UserProfile, useUser } from '@auth0/nextjs-auth0';

interface OwnProps {
  task: Task;
}

export default function CurrentTask({ task }: OwnProps) {
  const { user } = useUser();
  const [isShowingMenu, setIsShowingMenu] = useState(false);
  const [isShowingAbandon, setIsShowingAbandon] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState('');
  const confirmDeleteCheck = `${task.clientName}/${task.name}`;

  useEffect(() => {
    //console.log('Current Task:', task);
  }, []);

  function toggleMenu() {
    setIsShowingMenu(!isShowingMenu);
  }
  function toggleAbandon() {
    setIsShowingAbandon(!isShowingAbandon);
  }
  function resetAllPops() {
    setIsShowingAbandon(false);
    setIsShowingMenu(false);
    setConfirmDelete('');
  }

  async function handleSubmit() {
    const response = await axios.put('/api/tasks/current', {
      task: task,
      name: user?.name ?? 'Freelancer',
      discordChannelId: task.discordChannelId,
    });
    console.log(response);
  }
  async function abandonTask() {
    resetAllPops();
    if (user === undefined) {
      console.log('user is undefined');
      return;
    }
    const response = await axios.put('/api/tasks/abandon-task', {
      task: task,
      discordChannelId: task.discordChannelId,
      discordUserId: user.sub?.split('|')[2],
    });
    console.log(response);
  }

  return (
    <>
      {isShowingAbandon ? (
        <div className="absolute top-0 left-0 z-50 bg-black bg-opacity-90 grid place-content-center w-screen h-screen">
          <div className="bg-white p-6 rounded-lg max-w-lg text-center">
            <p className="my-3 font-thin text-4xl">Are you sure?</p>
            <p className="text-center mb-8 mx-6">
              Abandoning this current task will mean you won't be paid for the
              work done until this point.
            </p>
            <div className="flex flex-col my-2">
              <label className="my-3 text-center" htmlFor="delete">
                Please type
                <span className="mx-2 py-1 px-2 rounded-lg bg-gray-100 font-bold">
                  {task.clientName}/{task.name}
                </span>
                to confirm.
              </label>
              <input
                id="delete"
                className="mx-6 rounded bg-blue-100 leading-8 pl-2"
                type="text"
                onChange={(e) => {
                  setConfirmDelete(e.target.value);
                }}
              />
            </div>
            <div className="mt-4 flex justify-center">
              <button
                className="disabled:opacity-20  px-5 py-2 rounded border-2 border-red-800 text-red-800 disabled:hover:bg-white disabled:cursor-default hover:bg-red-100 hover:text-red-900 font-semibold transition ease-in-out duration-500"
                disabled={confirmDelete !== confirmDeleteCheck}
                onClick={abandonTask}
              >
                Yes, Abandon Task
              </button>
              <button
                onClick={resetAllPops}
                className="px-3 py-1 ml-4 rounded bg-blue-500 hover:bg-blue-500 text-white font-semibold"
              >
                Keep working on task.
              </button>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className="relative">
        {isShowingMenu ? (
          <div className="absolute px-3 py-3 z-10 right-2 top-12 -left-20 border-2 border-blue-500 bg-white shadow-md rounded-lg">
            <div className="text-left">
              <p className="text-lg">{task.clientName}</p>
              <p className="text-sm">{task.longDesc}</p>
              <div className="mt-6 flex justify-center">
                <button
                  onClick={toggleAbandon}
                  className="px-3 py-2 rounded bg-red-800 hover:bg-red-600 text-red-100 font-medium hover:text-white transition ease-in-out duration-500"
                >
                  Abandon Task
                </button>
                <button className="px-3 py-1 ml-4 rounded border-2 border-blue-500 text-blue-800 hover:text-blue-900 hover:bg-blue-50">
                  Request Help
                </button>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
        <div className="bg-blue-100 text-blue-900 shadow p-4 rounded-md max-w-[15rem]">
          <div className="text-left">
            <div className="flex justify-between items-start">
              <h3 className="text-lg">{task.name}</h3>
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
            <button
              className="bg-blue-900 hover:bg-blue-700 font-medium transform ease-in-out duration-500 w-full text-white px-3 py-2 rounded"
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
