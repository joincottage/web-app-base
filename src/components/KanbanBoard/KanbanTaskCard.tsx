import { Tooltip } from '@material-ui/core';
import { Task } from '.prisma/client';
import useTasksUsername from './../../hooks/useTaskUsername';
import Avatar from '@material-ui/core/Avatar';
import { useContext, useState } from 'react';
import { AppDataContext } from 'src/contexts/AppContext';
import { RequestStatus } from 'src/constants/request-status';
import LoadingSpinner from 'src/components/LoadingSpinner';
import { Button } from '@material-ui/core';
import Axios from 'axios';

interface OwnProps {
  task: Task;
  mode: 'freelancer' | 'client';
  showAcceptButton?: boolean;
  showUserImg?: boolean;
  showCompanyLogo?: boolean;
  styles?: any;
}
export default function KanbanTaskCard({
  task,
  mode,
  showAcceptButton,
  showUserImg,
  showCompanyLogo = true,
  styles = {},
}: OwnProps) {
  const { username, loading, error } = useTasksUsername();
  const { state, dispatch } = useContext(AppDataContext);
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(
    RequestStatus.IDLE
  );

  const submitPayment = async () => {
    setRequestStatus(RequestStatus.PENDING);
    try {
      await Axios.post('/api/stripe/submit-payment', {
        task,
      });
      setRequestStatus(RequestStatus.SUCCEEDED);
    } catch (e) {
      setRequestStatus(RequestStatus.FAILED);
      throw e;
    }

    try {
      await Axios.post('/api/discord/notify-task-complete', {
        discordChannelId: task.discordChannelId,
        task,
      });
    } catch (e) {
      // TODO: roll back payment if this fails, since it will still appear in the "review" column.
      throw e;
    }
  };

  return (
    <div
      className="rounded-lg my-3 mx-3 bg-white"
      style={{
        border: '1px solid rgb(217, 222, 227)',
      }}
    >
      <div className="text-left px-3 py-2">
        <div className="flex justify-between">
          {task.userId && (
            <Avatar
              className="h-6 w-6 ml-1 mr-3"
              alt="User image"
              src={task.userImgUrl || ''}
            />
          )}
          <h3>{task.name}</h3>

          <Tooltip title={`${task.shortDesc} - $${task.price}`}>
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
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </Tooltip>
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: '15x',
            marginBottom: '5px',
            justifyContent: 'center',
          }}
        >
          {showAcceptButton && (
            <div style={{ marginTop: '15px' }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {}}
                style={{ marginRight: '10px' }}
              >
                View pull request
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={submitPayment}
              >
                {requestStatus === RequestStatus.IDLE ? (
                  'Accept and Pay'
                ) : requestStatus === RequestStatus.PENDING ? (
                  <LoadingSpinner />
                ) : requestStatus === RequestStatus.FAILED ? (
                  'Failed. Click to retry'
                ) : (
                  'Accept and Pay'
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
