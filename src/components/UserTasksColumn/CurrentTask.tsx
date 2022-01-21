import { Task } from '.prisma/client';
import { useUser } from '@auth0/nextjs-auth0';
import { Button, Typography } from '@material-ui/core';
import axios from 'axios';
import { useContext } from 'react';
import setCurrentTask from 'src/actions/setCurrentTask';
import setTasksInReview from 'src/actions/setTasksInReview';
import CurrentTaskMenu from 'src/components/menus/CurrentTaskMenu';
import { AppDataContext } from 'src/contexts/AppContext';

interface OwnProps {
  task: Task;
}

export default function CurrentTask({ task }: OwnProps) {
  const { user } = useUser();
  const ideLink = 'https://cloudcoder.network/ws/51758359595864/ide/';

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
        <div className="bg-blue-100 shadow p-3 rounded-md max-w-[15rem]">
          <div className="text-left">
            <div className="flex justify-between items-center pb-2">
              <Typography
                variant="subtitle2"
                className="font-bold"
                style={{
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  maxWidth: '216px',
                }}
              >
                {task.name}
              </Typography>
              <CurrentTaskMenu />
            </div>
            <Button
              className="w-full"
              variant="contained"
              onClick={openLinks}
              style={{ marginBottom: '.75rem' }}
            >
              Open IDE
            </Button>
            <Button
              className="w-full leading-7"
              variant="outlined"
              onClick={handleSubmitForReview}
              style={{ backgroundColor: 'white' }}
            >
              Submit For Review
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
