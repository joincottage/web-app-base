import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { AppDataContext } from '../contexts/AppContext';
import setSelectedClient from 'src/actions/setSelectedClient';
import { Avatar, Fade } from '@mui/material';
import { Client } from '@prisma/client';
import ClientColumnLoadingState from './emptystates/ClientColumnLoadingState';
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
    <Box sx={{ width: '120px' }} style={{ position: 'relative' }}>
      <Fade in={clients.length === 0}>
        <Box style={{ position: 'absolute', top: 0 }}>
          <ClientColumnLoadingState />
        </Box>
      </Fade>
      <Fade in={clients.length > 0} timeout={500}>
        <Box
          style={{
            position: 'absolute',
            top: 0,
            backgroundColor: 'white',
            borderRadius: '6px',
            border: '1px solid rgb(224, 224, 224)',
            width: '100px',
          }}
        >
          <Tabs
            orientation="vertical"
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            {renderableClients.map((client, index) => (
              <Fade in={true} timeout={(index + 1) * 500} key={index}>
                <Tab
                  onClick={() => {
                    dispatch(setSelectedClient(client.original));
                  }}
                  icon={client.logo}
                  label={client.name}
                  style={{
                    borderBottom:
                      index < renderableClients.length - 1
                        ? '1px solid rgb(224, 224, 224)'
                        : 'none',
                  }}
                  {...a11yProps(index)}
                />
              </Fade>
            ))}
          </Tabs>
        </Box>
      </Fade>
    </Box>
  );
}
