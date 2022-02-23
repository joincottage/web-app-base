import { Client, Task } from '.prisma/client';
import { Backdrop, Button, Modal, Tooltip } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { TASK_QUEUED } from 'src/constants/task-stages';
import { AppDataContext } from 'src/contexts/AppContext';
import CreateATask from './../CreateATask';
import AcceptAndPayModal from './AcceptAndPayModal';

interface OwnProps {
  task: Task;
  mode: 'freelancer' | 'client';
  showAcceptButton?: boolean;
  showUserImg?: boolean;
  showCompanyLogo?: boolean;
  styles?: any;
}

export default function KanbanTaskCard({ task, showAcceptButton }: OwnProps) {
  const router = useRouter();
  const [isCreateATaskOpen, setIsCreateATaskOpen] = useState(
    router.query.showCreateTask === 'true'
  );
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const { state } = useContext(AppDataContext);

  const handleClickCreateATask = () => {
    if (task.status == TASK_QUEUED) {
      setIsCreateATaskOpen(true);
    }
    // sa_event('click_IllDoIt');
  };
  const handleCloseCreateATask = () => {
    setIsCreateATaskOpen(false);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
  };

  const handleClickPayment = () => {
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="bg-white" style={{ borderRadius: '4px' }}>
      <div className="text-left px-3 py-2">
        <div className="flex justify-between">
          {task.userId && (
            <Avatar
              className="h-6 w-6 ml-1 mr-3"
              alt="User image"
              src={task.userImgUrl || ''}
            />
          )}
          <h3 className="cursor-pointer" onClick={handleClickCreateATask}>
            {task.name}
          </h3>

          <Tooltip title={`${task.shortDesc} - $${task.price}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-400 cursor-pointer"
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
                style={{ marginRight: '10px' }}
              >
                View PR
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleClickPayment}
              >
                Accept
              </Button>
            </div>
          )}
        </div>
      </div>
      <div>
        <Modal
          open={isCreateATaskOpen}
          onClose={handleCloseCreateATask}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          closeAfterTransition
          BackdropProps={{
            timeout: 500,
          }}
          className="rounded-2xl"
        >
          <div className="w-[700px] bg-white border-2 border-white mx-auto mt-44 rounded-lg ">
            <CloseIcon
              onClick={handleCloseCreateATask}
              className="w-6 h-6 float-right m-4"
            />
            <div className="my-12">
              <CreateATask
                client={state.selectedClient as Client}
                task={task}
              />
            </div>
          </div>
        </Modal>
        <Modal
          open={isPaymentModalOpen}
          onClose={handleClosePaymentModal}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <div>
            <AcceptAndPayModal
              task={task}
              handleClose={handleClosePaymentModal}
            />
          </div>
        </Modal>
      </div>
    </div>
  );
}
