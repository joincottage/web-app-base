import { Task } from '.prisma/client';
import { Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import OpenInNew from '@material-ui/icons/OpenInNew';
import BugReportOutlinedIcon from '@material-ui/icons/BugReportOutlined';
import CubeTransparentOutlineIcon from '../icons/CubeTransparentOutlineIcon';
import { RequestStatus } from './../../constants/request-status';
import Axios from 'axios';
import { useContext, useState } from 'react';
import setCurrentTask from 'src/actions/setCurrentTask';
import { AppDataContext } from 'src/contexts/AppContext';

interface OwnProps {
  task: Task;
  handleClose: () => void;
}

export default function TaskDetailsModal({ task, handleClose }: OwnProps) {
  const { state } = useContext(AppDataContext);

  const [requestStatus, setRequestStatus] = useState<RequestStatus>(
    RequestStatus.IDLE
  );
  const { dispatch } = useContext(AppDataContext);

  const handleRequestAccess = async () => {
    setRequestStatus(RequestStatus.PENDING);
    try {
      //FIXME: This needs to switch to v2/tasks/index
      await Axios.post('/api/v2/tasks', {
        task,
      });
      setRequestStatus(RequestStatus.SUCCEEDED);
      dispatch(setCurrentTask(task));
      handleClose();
    } catch (e) {
      setRequestStatus(RequestStatus.FAILED);
      throw e;
    }
  };

  return (
    <div className="bg-white rounded-lg fixed h-[751px] w-[1040px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="flex w-full h-full">
        <div className="border-r-2 border-primary-500">
          {/* Company info */}
          <div className="w-[246px]">
            <div className="">
              <div className="mt-[13px] flex justify-center">
                <img
                  className="w-[107px] aspect-square rounded-full"
                  src={task.clientImgUrl || '#'}
                  alt="Client Image"
                />
              </div>
              <div className="flex justify-center">
                <h3 className="text-center text-xl mt-[22px] font-medium rounded-md">
                  {task.clientName}
                </h3>
              </div>
            </div>
            <div className="mt-[22px] flex justify-center">
              <p
                className="text-sm w-[191px]"
                style={{ fontSize: '12px', textAlign: 'center' }}
              >
                {/*FIXME: create a client bio in client schema */}
                Client bio lorem expedita doloremque sapiente alias iste
                expedita! Culpa reprehenderit aliquam quibusdam neque.
              </p>
            </div>
            <div className="mt-[22px] flex justify-center items-center my-4">
              <OpenInNew />
              <a
                className="ml-1  text-primary-500 uppercase font-medium"
                href="#"
              >
                Visit Website
              </a>
            </div>
          </div>
        </div>
        <div className="relative w-full flex flex-col justify-between">
          <div>
            <div>
              <h3 className="mt-[18px] text-xl text-center font-medium">
                {task.name}
              </h3>
              <div className="my-4 flex justify-center items-center">
                <p className="text-green-700 text-2xl font-bold">
                  ${task.price}
                </p>
                <div className="ml-3">
                  {task.type === 'bug' ? (
                    <BugReportOutlinedIcon style={{ fill: '#E00004' }} />
                  ) : (
                    <CubeTransparentOutlineIcon />
                  )}
                </div>
              </div>
              <div className="mt-3 flex justify-center">
                {task.skills?.split(',').map((skill) => (
                  <div
                    className="text-sm font-light text-gray-900 bg-gray-200 py-[6px] px-[12px] mx-[3px] rounded-full"
                    key={skill}
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>
            <div className="prose-sm text-gray-700 h-[539px] mt-[19px] mx-[19px]">
              <p>{task.longDesc}</p>
            </div>
          </div>
          <div className="mb-[16px] mr-[19px] h-[36px]  flex justify-between ">
            <div className="flex align-baseline"></div>
            <div className="flex items-baseline ml-3">
              <Button className="mx-1" variant="outlined" color="primary">
                <span className="text-xl">💰</span>
                <span className="text-sm">
                  &nbsp;Suggest&nbsp;higher&nbsp;price
                </span>
              </Button>
              <Button className="mx-1" variant="outlined" color="primary">
                <span className="text-xl">🤷</span>
                <span className="text-sm">&nbsp;Needs&nbsp;Info</span>
              </Button>
              <div className="">
                <Button
                  className="mb-2 ml-1"
                  variant="contained"
                  color="primary"
                  disabled={!!state.currentTask}
                  onClick={handleRequestAccess}
                >
                  <span className="text-xl">👍</span>
                  <span className="ml-1">I'll do it!</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute right-[24px] top-[18px]">
          <CloseIcon onClick={handleClose} className="cursor-pointer" />
        </div>
      </div>
    </div>
  );
}
