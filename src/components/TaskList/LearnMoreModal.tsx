//import CloseIcon from '@material-ui/icons/Close';
import { Task } from '.prisma/client';
import { useUser } from '@auth0/nextjs-auth0';
import CloseIcon from '@material-ui/icons/Close';

interface OwnProps {
  task: Task;
  close: Function;
}

export default function LearnMoreModal({ task, close }: OwnProps) {
  const { user } = useUser();

  function handleClose() {
    close();
  }

  return (
    <div className="bg-white rounded-lg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="float-right pr-6 py-3 cursor-pointer">
        <CloseIcon onClick={handleClose} />
      </div>
      <div className="flex">
        <div className="border-r-2 border-primary-500 w-72">
          {/* Company info */}
          <div className="mx-4 mb-4 px-3 py-4">
            <div className="flex justify-center">
              <img
                className="w-24 aspect-square rounded-full"
                src={task.clientImgUrl || '#'}
                alt="Client Image"
              />
            </div>
            <div className="flex justify-center">
              <h3 className="text-center text-xl px-3 py-1 text-primary-600 rounded-md">
                {task.clientName}
              </h3>
            </div>
            <div className="">
              <p className="text-sm my-2 px-2 py-1 bg-gray-50 rounded-lg text-gray-700">
                {/*FIXME: create a client bio in client schema */}
                Client Bio Lorem expedita doloremque sapiente alias iste
                expedita! Culpa reprehenderit aliquam quibusdam neque.
              </p>
            </div>
            <div className="flex justify-center">
              <a
                className="text-center px-2 text-primary-300 hover:underline hover:text-primary-600"
                href=""
              >
                {/*FIXME: create a client website in client schema */}
                View {task.clientName} Website Here!
              </a>
            </div>
          </div>
        </div>
        <div className="m-4">
          <h3 className="pt-6 text-xl text-center">{task.name}</h3>
          <div className="my-6 mx-4 max-w-prose prose-sm text-gray-700 h-96">
            <p>{task.longDesc}</p>
          </div>
          <div className="flex justify-between items-baseline">
            <div className="flex align-baseline">
              {task.skills?.split(',').map((skill) => (
                <div
                  className="text-sm font-light text-gray-700 bg-gray-200 h-7 py-1 px-2 mx-2 rounded-full"
                  key={skill}
                >
                  {skill}
                </div>
              ))}
            </div>
            <div className="">
              {/* TODO: update to i'll do it button */}
              <button className="button-primary ">I'll do it!</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
