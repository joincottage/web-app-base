import { Client } from '@prisma/client';
import React, { Dispatch } from 'react';
import { SavedUserState } from 'src/actions/setUser';

export type AllClients = { name: 'All' };
export interface AppState {
  selectedClient: Client | AllClients;
  user: SavedUserState;
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
  user: {
    hasCurrentTask: false,
  },
};
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const AppDataContext = React.createContext<AppContext>({
  state: initialState,
  dispatch: () => {},
});
