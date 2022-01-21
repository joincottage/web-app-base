import React, { useMemo, useReducer, useState } from 'react';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../theme';
import { Navbar } from '../components/Navbar';
import { UserProvider } from '@auth0/nextjs-auth0';
import { AppProps } from 'next/app';
import {
  AppAction,
  AppContext,
  AppDataContext,
  AppState,
  initialState,
} from '../contexts/AppContext';
import './../styles/theme.css';
import './../styles/RichTextEditor.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { SET_SELECTED_CLIENT } from 'src/actions/setSelectedClient';
import { SET_CURRENT_TASK } from 'src/actions/setCurrentTask';
import { SET_TASKS_IN_REVIEW } from 'src/actions/setTasksInReview';
import { SET_PREVIOUS_TASKS } from 'src/actions/setPreviousTasks';
import { SET_TASKS_IN_QUEUE } from 'src/actions/setTasksInQueue';
import { SET_ACTIVE_FILTERS } from 'src/actions/setActiveFilters';
import { SET_ACTIVE_SEARCH_TERM } from 'src/actions/setActiveSearchTerm';
import { SET_CREATE_A_TASK_STATE } from 'src/actions/setCreateATaskState';
import SmokeMachine from 'src/components/SmokeMachine';
import Image from 'next/image';
import { useRouter } from 'next/router';

function appReducer(state: AppState, action: AppAction) {
  switch (action.type) {
    case SET_SELECTED_CLIENT:
      return {
        ...state,
        selectedClient: action.payload.selectedClient,
      };
    case SET_CURRENT_TASK:
      return {
        ...state,
        currentTask: action.payload.currentTask,
      };
    case SET_TASKS_IN_REVIEW:
      return {
        ...state,
        tasksInReview: action.payload.tasksInReview,
      };
    case SET_PREVIOUS_TASKS:
      return {
        ...state,
        previousTasks: action.payload.previousTasks,
      };
    case SET_TASKS_IN_QUEUE:
      return {
        ...state,
        tasksInQueue: action.payload.tasksInQueue,
      };
    case SET_ACTIVE_FILTERS:
      return {
        ...state,
        activeFilters: action.payload.activeFilters,
      };
    case SET_ACTIVE_SEARCH_TERM:
      return {
        ...state,
        activeSearchTerm: action.payload.activeSearchTerm,
      };
    case SET_CREATE_A_TASK_STATE:
      return {
        ...state,
        serializedEditorState: action.payload.serializedEditorState,
      };
    default:
      // TODO: report unknown action types as an error
      throw new Error(`Unrecognized action: ${action.type}`);
  }
}

export default function MyApp(props: AppProps) {
  const { Component, pageProps } = props;
  const router = useRouter();
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [state, dispatch] = useReducer(appReducer, initialState);
  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]) as AppContext;
  const [isCottageActive, setIsCottageActive] = useState(true);

  return (
    <div className="viewport" style={{ width: '100vw', position: 'relative' }}>
      {router.pathname === '/' && (
        <>
          <div
            className="parallax forest"
            // @ts-ignore
            parallax="0.1"
            style={{
              backgroundImage: 'url("/forest.svg")',
              width: '150vw',
              height: '1500px',
              marginBottom: '-1500px',
              position: 'fixed',
            }}
          ></div>
          <div
            className="parallax"
            // @ts-ignore
            parallax="0.25"
            style={{
              position: 'fixed',
            }}
          >
            <div className="forest-mask"></div>
            <div
              style={{
                position: 'absolute',
                left: '30px',
                top: '360px',
                opacity: 0.5,
              }}
            >
              {isCottageActive && <SmokeMachine />}
            </div>
            <div
              onClick={() => setIsCottageActive(true)}
              style={{
                position: 'absolute',
                left: '235px',
                top: '712px',
                width: '125px',
                height: '125px',
                zIndex: 999999,
                cursor: 'pointer',
              }}
            >
              {isCottageActive ? (
                <Image src="/cottage-light.png" width={300} height={300} />
              ) : (
                <Image src="/cottage.png" width={300} height={300} />
              )}
            </div>
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: '785px',
                width: '100vw',
                height: '750px',
                overflow: 'hidden',
              }}
            >
              <Image src="/hill.png" width={500} height={500} />
              <div
                style={{
                  position: 'absolute',
                  width: '950px',
                  height: '800px',
                  bottom: '-700px',
                  left: '-70px',
                  top: '350px',
                  background:
                    'linear-gradient(135deg, rgb(184, 185, 186) 40%, transparent 50%);',
                  transform: 'rotate(45deg)',
                }}
              ></div>
            </div>
          </div>
        </>
      )}
      <UserProvider>
        <AppDataContext.Provider value={contextValue}>
          <Head>
            <title>Cottage</title>
            <meta
              name="viewport"
              content="minimum-scale=1, initial-scale=1, width=device-width"
            />
          </Head>
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <Navbar />
            <Component {...pageProps} />
          </ThemeProvider>
        </AppDataContext.Provider>
      </UserProvider>
    </div>
  );
}
