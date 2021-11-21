export const SET_USER = 'SET_USER';
export interface SavedUserState {
  hasCurrentTask: boolean;
}

export interface SetUserAction {
  type: typeof SET_USER;
  payload: {
    user: SavedUserState;
  };
}

const setUser = (user: SavedUserState): SetUserAction => ({
  type: SET_USER,
  payload: { user: user },
});

export default setUser;
