export const SET_ACTIVE_FILTERS = 'SET_ACTIVE_FILTERS';
export interface SetActiveFiltersAction {
  type: typeof SET_ACTIVE_FILTERS;
  payload: {
    activeFilters: string[];
  };
}

const setActiveFilters = (activeFilters: string[]): SetActiveFiltersAction => ({
  type: SET_ACTIVE_FILTERS,
  payload: { activeFilters: activeFilters },
});

export default setActiveFilters;
