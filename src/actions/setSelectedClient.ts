import { Client } from '@prisma/client';

export const SET_SELECTED_CLIENT = 'SET_SELECTED_CLIENT';
export interface SetSelectClientAction {
  type: typeof SET_SELECTED_CLIENT;
  payload: {
    selectedClient: Client;
  };
}

const setSelectedClient = (client: Client): SetSelectClientAction => ({
  type: SET_SELECTED_CLIENT,
  payload: { selectedClient: client },
});

export default setSelectedClient;
