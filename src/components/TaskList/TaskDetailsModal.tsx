import { Task } from '.prisma/client';
import { Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import OpenInNew from '@material-ui/icons/OpenInNew';
import BugReportOutlinedIcon from '@material-ui/icons/BugReportOutlined';
import CubeTransparentOutlineIcon from '../icons/CubeTransparentOutlineIcon';

interface OwnProps {
  task: Task;
  handleClose: () => void;
}

export default function TaskDetailsModal({ task, handleClose }: OwnProps) {
  return (
    <div className="bg-white rounded-lg fixed h-[751px] w-[1040px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="flex w-full h-full">
        <div className="border-r-2 border-primary-500 w-72">
          {/* Company info */}
          <div className="w-[17rem]">
            <div className="">
              <div className="mt-4 flex justify-center">
                <img
                  className="w-32 aspect-square rounded-full"
                  src={task.clientImgUrl || '#'}
                  alt="Client Image"
                />
              </div>
              <div className="flex justify-center">
                <h3 className="text-center text-xl my-4 px-3 py-1 font-medium rounded-md">
                  {task.clientName}
                </h3>
              </div>
            </div>
            <div className="flex justify-center">
              <p className="text-sm my-3 mx-8">
                {/*FIXME: create a client bio in client schema */}
                Client bio lorem expedita doloremque sapiente alias iste
                expedita! Culpa reprehenderit aliquam quibusdam neque.
              </p>
            </div>
            {/*FIXME: create a client bio in client schema */}
            <div className="flex justify-center items-center my-4">
              <OpenInNew />
              <a className="ml-1 text-primary-500 text-lg font-medium" href="#">
                Visit Website
              </a>
            </div>
          </div>
        </div>
        <div className="relative w-full flex flex-col justify-between">
          <div>
            <div>
              <h3 className="pt-6 text-2xl text-center font-bold">
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
                    className="text-sm font-light text-gray-700 bg-gray-200 h-7 py-1 px-2 mx-2 rounded-full"
                    key={skill}
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>
            <div className="my-6 mx-4 prose-sm text-gray-700 h-full">
              <p>{task.longDesc}</p>
            </div>
          </div>
          <div className="mb-6 mr-4 flex justify-between ">
            <div className="flex align-baseline"></div>
            <div className="flex items-baseline ml-3">
              <Button className="mx-1" variant="outlined" color="primary">
                <span className="text-xl">💰</span>
                <span className="text-sm">&nbsp;Too&nbsp;Cheap</span>
              </Button>
              <Button className="mx-1" variant="outlined" color="primary">
                <span className="text-xl">🤷</span>
                <span className="text-sm">&nbsp;Needs&nbsp;Info</span>
              </Button>
              <div className="">
                {/* TODO: update to i'll do it button */}
                <Button
                  className="mb-2 ml-1"
                  variant="contained"
                  color="primary"
                >
                  <span className="text-xl">👍</span>
                  <span className="ml-1">I'll do it!</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute right-4 top-3">
          <CloseIcon onClick={handleClose} className="cursor-pointer" />
        </div>
      </div>
    </div>
  );
}
