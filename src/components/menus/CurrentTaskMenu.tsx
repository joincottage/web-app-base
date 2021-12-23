import { UserProfile } from '@auth0/nextjs-auth0';
import React, { useContext, useState } from 'react';
import Link from 'next/link';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import HelpIcon from '@material-ui/icons/Help';
import { IconButton } from '@material-ui/core';
import { Task } from '.prisma/client';
import setCurrentTask from 'src/actions/setCurrentTask';
import { AppDataContext } from 'src/contexts/AppContext';
import axios from 'axios';

interface OwnProps {
  style?: any;
  user?: UserProfile;
  task: Task;
}

export default function CurrentTaskMenu({
  style,
  user,
  task,
}: OwnProps): JSX.Element {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { state, dispatch } = useContext(AppDataContext);
  const [isShowingMenu, setIsShowingMenu] = useState(false);
  const [isShowingAbandon, setIsShowingAbandon] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState('');
  const confirmDeleteCheck = `${task.clientName}/${task.name}`;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  async function handleAbandonTask() {
    dispatch(setCurrentTask(null));
    if (user === undefined) {
      console.log('user is undefined');
      return;
    }
    await axios.put('/api/tasks/abandon-task', {
      task,
      discordChannelId: task.discordChannelId,
      discordUserId: user.sub?.split('|')[2],
    });
  }

  const AbandonTaskModal = () => (
    <div className="fixed top-0 left-0 z-50 bg-black bg-opacity-90 grid place-content-center w-screen h-screen">
      <div className="bg-gray-200 p-6 rounded-lg max-w-lg text-center">
        <p className="my-3 text-red-700 font-semibold text-2xl">
          Are you sure?
        </p>
        <p className="text-center mb-8 mx-6">
          Abandoning this current task will mean you won't be paid for the work
          done until this point.
        </p>
        <div className="flex flex-col my-2">
          <label className="my-3" htmlFor="delete">
            Please type
            <span className="mx-2 py-1 px-2 rounded-lg bg-gray-300 font-medium">
              {task.clientName}/{task.name}
            </span>
            to confirm.
          </label>
          <input
            id="delete"
            className="mx-6 rounded leading-8 pl-2"
            type="text"
            onChange={(e) => {
              setConfirmDelete(e.target.value);
            }}
          />
        </div>
        <div className="mt-6 flex justify-center">
          <button
            className="mx-3 button-secondary-destructive disabled:hover:bg-white"
            disabled={confirmDelete !== confirmDeleteCheck}
            onClick={handleAbandonTask}
          >
            Yes, Abandon Task
          </button>
          <button className="mx-3 button-primary">Keep working on task.</button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <IconButton
        color="inherit"
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
        style={{ color: 'white' }}
      >
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
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Abandon Task</MenuItem>
      </Menu>
    </div>
  );
}
