import React, { Dispatch } from "react";
export interface AppState {
  client: {
    name: string;
    logo: JSX.Element;
    largeLogo?: JSX.Element;
  }
}
export interface AppAction {
  type: string;
  payload: Partial<AppState>;
}
export interface AppContext {
  state: AppState;
  dispatch: Dispatch<AppAction>
};

export const initialState: AppState = {
  client: {
    name: '',
    logo: <div></div>
  }
};
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const AppDataContext = React.createContext<AppContext>({ state: initialState, dispatch: () => { } });