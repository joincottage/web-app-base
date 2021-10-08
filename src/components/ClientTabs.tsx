import * as React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { AppDataContext } from '../contexts/AppContext';

export interface ClientInfo {
  name: string;
  logo: JSX.Element;
}
interface OwnProps {
  clients: ClientInfo[];
}
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
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
        <Tabs orientation="vertical" value={value} onChange={handleChange} aria-label="basic tabs example">
          { clients.map((client, index) => <Tab onClick={() => {
            dispatch({
              type: 'SET_SELECTED_CLIENT',
              payload: { client },
            });
          }} icon={client.logo} label={client.name} {...a11yProps(index)} />)}
        </Tabs>
      </Box>
    </Box>
  );
}