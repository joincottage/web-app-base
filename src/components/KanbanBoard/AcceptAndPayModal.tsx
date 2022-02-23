import { useState } from 'react';
import { Task, User } from '.prisma/client';
import Axios from 'axios';
import { Button } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import CloseIcon from '@mui/icons-material/Close';
import { RequestStatus } from 'src/constants/request-status';

interface OwnProps {
  task: Task & { freelancer?: User };
  handleClose: () => void;
}

export default function AcceptAndPayModal({ task, handleClose }: OwnProps) {
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
      handleClose();
    } catch (e) {
      setRequestStatus(RequestStatus.FAILED);
      throw e;
    }
  };

  return (
    <div className="bg-white rounded-lg fixed h-[357px] w-[522px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="text-center mt-3">
        <h3 className="text-lg font-medium">{task.name}</h3>
        <p className="mt-3 text-lg font-semibold text-green-700">
          ${task.price}
        </p>
      </div>
      <div className="flex justify-center items-center my-3">
        {task.userId && (
          <Avatar
            className="h-8 w-8 ml-1 mr-4"
            alt="User image"
            src={task.userImgUrl || ''}
          />
        )}
        <p className="font-xl font-bold">{task.freelancer?.name}</p>
      </div>
      <div className="flex justify-center mt-12">
        <p className="text-center font-light text-2xl w-[309px]">
          Are you sure you want to accept the work and pay the freelancer?
        </p>
      </div>
      <div className="float-right mt-10 mr-4">
        <div>
          <Button
            className="h-9"
            variant="outlined"
            color="primary"
            onClick={handleClose}
            disabled={requestStatus === RequestStatus.PENDING}
          >
            <span className="text-sm">Cancel</span>
          </Button>
          <Button
            className="ml-2"
            variant="contained"
            color="primary"
            onClick={submitPayment}
            disabled={requestStatus === RequestStatus.PENDING}
          >
            <span className="font-semibold">
              {requestStatus === RequestStatus.PENDING
                ? 'Submitting...'
                : "Yes, I'm sure"}
            </span>
          </Button>
        </div>
      </div>
      <div className="absolute right-4 top-3">
        <CloseIcon onClick={handleClose} className="cursor-pointer" />
      </div>
    </div>
  );
}
