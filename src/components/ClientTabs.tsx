import * as React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import { AppDataContext } from '../contexts/AppContext';
import setSelectedClient from 'src/actions/setSelectedClient';
import { Avatar } from '@material-ui/core';
import { Client } from '@prisma/client';
interface OwnProps {
  clients: Client[];
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

  const renderableClients = clients.map((c) => ({
    name: c.name as string,
    logo:
      c.logoUrl === undefined ? (
        <></>
      ) : (
        <Avatar
          sx={{ width: 24, height: 24 }}
          alt="Company logo"
          src={c.logoUrl as string}
          aria-haspopup="true"
        />
      ),
    largeLogo:
      c.logoUrl === undefined ? (
        <></>
      ) : (
        <Avatar
          sx={{ width: 80, height: 80 }}
          alt="Company logo"
          src={c.logoUrl as string}
          aria-haspopup="true"
        />
      ),
    original: c,
  }));

  return (
    <Box sx={{ width: '100%' }}>
      <Box>
        <Tabs
          orientation="vertical"
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          {renderableClients.map((client, index) => (
            <Tab
              key={index}
              onClick={() => {
                dispatch(setSelectedClient(client.original));
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
