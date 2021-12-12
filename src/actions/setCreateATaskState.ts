export const SET_CREATE_A_TASK_STATE = 'SET_CREATE_A_TASK_STATE';
export interface SetCreateATaskState {
  type: typeof SET_CREATE_A_TASK_STATE;
  payload: {
    serializedEditorState: string;
  };
}

const SetCreateATaskState = (
  serializedEditorState: string
): SetCreateATaskState => ({
  type: SET_CREATE_A_TASK_STATE,
  payload: { serializedEditorState },
});

export default SetCreateATaskState;
