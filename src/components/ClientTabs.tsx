import * as React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import { AppDataContext } from '../contexts/AppContext';

export interface ClientInfo {
  name: string;
  logo: JSX.Element;
}
interface OwnProps {
  clients: ClientInfo[];
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs({ clients }: OwnProps) {
  const [value, setValue] = React.useState(0);
  const { dispatch } = React.useContext(AppDataContext);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box>
        <Tabs
          orientation="vertical"
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          {clients.map((client, index) => (
            <Tab
              key={index}
              onClick={() => {
                dispatch({
                  type: 'SET_SELECTED_CLIENT',
                  payload: { client },
                });
              }}
              icon={client.logo}
              label={client.name}
              {...a11yProps(index)}
            />
          ))}
        </Tabs>
      </Box>
    </Box>
  );
}
