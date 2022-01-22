import { UserProvider } from '@auth0/nextjs-auth0';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useMemo, useReducer } from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { SET_ACTIVE_FILTERS } from 'src/actions/setActiveFilters';
import { SET_ACTIVE_SEARCH_TERM } from 'src/actions/setActiveSearchTerm';
import { SET_CREATE_A_TASK_STATE } from 'src/actions/setCreateATaskState';
import { SET_CURRENT_TASK } from 'src/actions/setCurrentTask';
import { SET_PREVIOUS_TASKS } from 'src/actions/setPreviousTasks';
import { SET_SELECTED_CLIENT } from 'src/actions/setSelectedClient';
import { SET_TASKS_IN_QUEUE } from 'src/actions/setTasksInQueue';
import { SET_TASKS_IN_REVIEW } from 'src/actions/setTasksInReview';
import Parallax from 'src/components/Parallax';
import { Navbar } from '../components/Navbar';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import cookieCutter from 'cookie-cutter';
import {
  AppAction,
  AppContext,
  AppDataContext,
  AppState,
  initialState,
} from '../contexts/AppContext';
import theme from '../theme';
import './../styles/RichTextEditor.css';
import './../styles/theme.css';
import Axios from 'axios';
import { COTTAGE_ANONID } from 'src/constants/cookies';

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

    // Record page views
    Axios.post('/api/appinsights/publish', {
      EventType: 'PageView',
      Value: router.pathname,
      AnonId: cookieCutter.get(COTTAGE_ANONID),
      Metadata: '',
    });

    // Figure out where new users come from
    if (document.referrer) {
      Axios.post('/api/appinsights/publish', {
        EventType: 'Referral',
        Value: document.referrer,
        AnonId: cookieCutter.get(COTTAGE_ANONID),
        Metadata: '',
      });
    }

    // Record device dimensions
    Axios.post('/api/appinsights/publish', {
      EventType: 'DeviceDimensions',
      Value: `${window.innerWidth} x ${window.innerHeight}`,
      AnonId: cookieCutter.get(COTTAGE_ANONID),
      Metadata: '',
    });
  }, []);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [state, dispatch] = useReducer(appReducer, initialState);
  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]) as AppContext;

  return (
    <div className="viewport" style={{ width: '100vw', position: 'relative' }}>
      {router.pathname === '/' && <Parallax />}
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
