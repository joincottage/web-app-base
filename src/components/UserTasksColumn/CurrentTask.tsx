import { useState, useEffect, useContext } from 'react';
import { Task } from '.prisma/client';
import axios from 'axios';
import { useUser } from '@auth0/nextjs-auth0';
import { Button } from '@material-ui/core';
import { AppDataContext } from 'src/contexts/AppContext';
import setCurrentTask from 'src/actions/setCurrentTask';
import setTasksInReview from 'src/actions/setTasksInReview';
import CurrentTaskMenu from 'src/components/menus/CurrentTaskMenu';

interface OwnProps {
  task: Task;
}

export default function CurrentTask({ task }: OwnProps) {
  const { user } = useUser();
  const ideLink = 'https://cloudcoder.network/ws/296689260511987/ide/';
  const devServerLink =
    'https://ws-571429178330112-port-3000.proxy.cloudcoder.network/';

  const { state, dispatch } = useContext(AppDataContext);

  function openLinks() {
    //window.open(devServerLink, '_blank');
    window.open(ideLink, '_blank');
  }

  async function handleSubmitForReview() {
    dispatch(setCurrentTask(null));
    dispatch(setTasksInReview([task, ...state.tasksInReview]));
    await axios.put('/api/tasks/current', {
      task,
      name: user?.name ?? 'Freelancer',
      discordChannelId: task.discordChannelId,
    });
  }

  return (
    <>
      <div className="relative">
        <div className="bg-blue-100 text-primary-900 shadow p-4 rounded-md max-w-[15rem]">
          <div className="text-left">
            <div className="flex justify-between items-center pb-2">
              <h3
                className="text-lg capitalize"
                style={{
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  maxWidth: '216px',
                }}
              >
                {task.name}
              </h3>
              <CurrentTaskMenu user={user} task={task} />
            </div>
            <Button
              className="mb-3 w-full"
              variant="contained"
              onClick={openLinks}
            >
              Open IDE
            </Button>
            <Button
              className="w-full leading-7 bg-white"
              variant="outlined"
              onClick={handleSubmitForReview}
            >
              Submit For Review
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
