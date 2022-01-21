export const SET_ACTIVE_SEARCH_TERM = 'SET_ACTIVE_SEARCH_TERM';
export interface SetActiveSearchTerm {
  type: typeof SET_ACTIVE_SEARCH_TERM;
  payload: {
    activeSearchTerm: string;
  };
}

const SetActiveSearchTerm = (
  activeSearchTerm: string
): SetActiveSearchTerm => ({
  type: SET_ACTIVE_SEARCH_TERM,
  payload: { activeSearchTerm },
});

export default SetActiveSearchTerm;
