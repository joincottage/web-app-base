import { Task } from '.prisma/client';
import { Button, Chip } from '@material-ui/core';
import BugReportOutlinedIcon from '@material-ui/icons/BugReportOutlined';
import CloseIcon from '@material-ui/icons/Close';
import Axios from 'axios';
import { convertFromRaw, EditorState } from 'draft-js';
import dynamic from 'next/dynamic';
import { useContext, useEffect, useState } from 'react';
import setCurrentTask from 'src/actions/setCurrentTask';
import { AppDataContext } from 'src/contexts/AppContext';
import useUser from 'src/hooks/useUser';
import CubeTransparentOutlineIcon from '../icons/CubeTransparentOutlineIcon';
import OnboardingPrompt from '../stripe/OnboardingPrompt';
import { RequestStatus } from './../../constants/request-status';

const Editor = dynamic(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false }
);
interface OwnProps {
  task: Task;
  handleClose: () => void;
}

export default function TaskDetailsModal({ task, handleClose }: OwnProps) {
  const { state, dispatch } = useContext(AppDataContext);
  const { user } = useUser();
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(
    RequestStatus.IDLE
  );
  const [showOnboardingPrompt, setShowOnboardingPrompt] = useState(false);

  const [editorState, setEditorState] = useState<EditorState | null>(null);
  useEffect(() => {
    const newEditorState = EditorState.createWithContent(
      convertFromRaw(JSON.parse(task.longDesc as string))
    );
    setEditorState(newEditorState);
  }, [task.longDesc]);

  const handleClickAcceptTask = async () => {
    if (!user?.stripeAccountId) {
      if (!showOnboardingPrompt) {
        setShowOnboardingPrompt(true);
      }

      return;
    }

    setRequestStatus(RequestStatus.PENDING);
    try {
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

  const handleClickPreviewCodebase = () => {
    window.open('https://cloudcoder.network/ws/51758359595864/ide/', '_blank');
  };

  return (
    <div className="bg-white rounded-lg fixed h-[770px] w-[1040px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="flex w-full h-full">
        <div className="border-r-2 border-primary-500">
          {/* Company info */}
          <div className="w-[246px] flex flex-col items-center">
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
              <p className="text-sm w-[191px]" style={{ fontSize: '12px' }}>
                {/*FIXME: create a client bio in client schema */}
                Cottage is a freelancing platform for software engineers.
                Cottage matches engineers with startups to perform tasks on a
                part time basis.
              </p>
            </div>
            <Button
              className="flex justify-center items-center my-4"
              variant="outlined"
              color="primary"
              size="large"
              onClick={handleClickPreviewCodebase}
              style={{ marginTop: '30px' }}
            >
              Preview codebase
            </Button>
            <div className="flex justify-center items-center my-4">
              <a
                className="text-primary-500 uppercase"
                href="https://joincottage.com"
                target="_blank"
                rel="noopener noreferrer"
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
                    <Chip
                      avatar={
                        <BugReportOutlinedIcon
                          style={{
                            fill: '#E00004',
                            background: 'none',
                          }}
                        />
                      }
                      label="Bug"
                      color="primary"
                      clickable
                      style={{ border: 'none' }}
                      variant="outlined"
                    />
                  ) : (
                    <Chip
                      avatar={
                        <CubeTransparentOutlineIcon
                          style={{
                            color: 'rgb(31,87,184)',
                            background: 'none',
                          }}
                        />
                      }
                      label="Feature"
                      color="primary"
                      variant="outlined"
                      style={{ border: 'none' }}
                    />
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
            <div className="prose-sm text-gray-700 h-[539px] m-[19px] overflow-scroll">
              <p>
                {editorState && (
                  <Editor
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    editorState={editorState}
                    readOnly
                    toolbarHidden
                  />
                )}
              </p>
            </div>
          </div>
          <div className="mb-[16px] mr-[19px] h-[36px]  flex justify-between ">
            <div className="flex align-baseline"></div>
            <div className="flex items-baseline ml-3">
              <Button
                variant="outlined"
                color="primary"
                style={{ marginLeft: '.25rem', marginRight: '.25rem' }}
                disabled={requestStatus === RequestStatus.PENDING}
              >
                <span className="text-xl">💰</span>
                <span className="text-sm">
                  &nbsp;Suggest&nbsp;higher&nbsp;price
                </span>
              </Button>
              <Button
                variant="outlined"
                color="primary"
                style={{ marginLeft: '.25rem', marginRight: '.5rem' }}
                disabled={requestStatus === RequestStatus.PENDING}
              >
                <span className="text-xl">ℹ️</span>
                <span className="text-sm">&nbsp;Needs&nbsp;Info</span>
              </Button>
              <OnboardingPrompt
                show={showOnboardingPrompt}
                handleClose={() => setShowOnboardingPrompt(false)}
              />
              <Button
                className="mb-2 ml-1"
                variant="contained"
                color="primary"
                disabled={
                  !!state.currentTask ||
                  requestStatus === RequestStatus.PENDING ||
                  showOnboardingPrompt
                }
                onClick={handleClickAcceptTask}
                style={{ marginBottom: '.25rem', width: '125px' }}
              >
                {requestStatus === RequestStatus.PENDING ? (
                  '...'
                ) : (
                  <>
                    <span className="text-xl">👍</span>
                    <span className="ml-1">I&apos;ll do it!</span>
                  </>
                )}
              </Button>
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
