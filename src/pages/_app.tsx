import React, { useMemo, useReducer } from 'react';
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

  return (
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
  );
}
