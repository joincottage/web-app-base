import { Client, Task } from '@prisma/client';
import React, { Dispatch } from 'react';

export type AllClients = { name: 'All' };
export interface AppState {
  selectedClient: Client | AllClients;
  currentTask: Task | null;
  tasksInReview: Task[];
  previousTasks: Task[];
  tasksInQueue: Task[];
  activeFilters: string[];
  activeSearchTerm: string;
  serializedEditorState: string;
}
export interface AppAction {
  type: string;
  payload: Partial<AppState>;
}
export interface AppContext {
  state: AppState;
  dispatch: Dispatch<AppAction>;
}

export const initialState: AppState = {
  selectedClient: {
    name: 'All',
  },
  currentTask: null,
  tasksInReview: [],
  previousTasks: [],
  tasksInQueue: [],
  activeFilters: [],
  activeSearchTerm: '',
  serializedEditorState: '',
};
export const AppDataContext = React.createContext<AppContext>({
  state: initialState,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispatch: () => {},
});
