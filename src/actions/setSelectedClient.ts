import { Client } from '@prisma/client';
import { AllClients } from 'src/contexts/AppContext';

export const SET_SELECTED_CLIENT = 'SET_SELECTED_CLIENT';
export interface SetSelectClientAction {
  type: typeof SET_SELECTED_CLIENT;
  payload: {
    selectedClient: Client | AllClients;
  };
}

const setSelectedClient = (
  client: Client | AllClients
): SetSelectClientAction => ({
  type: SET_SELECTED_CLIENT,
  payload: { selectedClient: client },
});

export default setSelectedClient;
