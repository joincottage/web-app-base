import React, { useContext, ChangeEvent } from 'react';
import Typography from '@material-ui/core/Typography';
import { Avatar } from '@material-ui/core';
import TaskList from 'src/components/TaskList';
import { Client } from '.prisma/client';
import { AppDataContext } from '../../contexts/AppContext';
import TaskTypeFilter from './TaskTypeFilter';
import { Input, InputAdornment } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import setActiveSearchTerm from 'src/actions/setActiveSearchTerm';

interface OwnProps {
  children: JSX.Element;
}

export default function TaskListContainer({ children }: OwnProps) {
  const { state, dispatch } = useContext(AppDataContext);
  const handleSearchTermChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setActiveSearchTerm(e.target.value));
  };
  return (
    <div>
      <p className="my-3 font-semibold flex justify-center">Available Tasks</p>
      <div
        style={{
          backgroundColor: 'white',
          border: '1px solid rgb(224, 224, 224)',
          borderRadius: '6px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '15px',
            paddingTop: '20px',
          }}
        >
          <span style={{ marginRight: '15px', height: 80 }}>
            {(state.selectedClient as Client).logoUrl && (
              <Avatar
                sx={{ width: 80, height: 80 }}
                alt="Company logo"
                src={(state.selectedClient as Client).logoUrl as string}
                aria-haspopup="true"
              />
            )}
          </span>
          <Typography variant="h5" style={{ paddingRight: '30px' }}>
            {state.selectedClient.name}
          </Typography>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingLeft: '40px',
            paddingRight: '40px',
            paddingBottom: '10px',
          }}
        >
          <Input
            placeholder="Search skills"
            className=" text-sm font-light text-gray-700 bg-gray-200 py-1 px-2 rounded-full"
            style={{ height: '32px', flexGrow: 1, marginRight: '10px' }}
            disableUnderline
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            }
            onChange={handleSearchTermChange}
          />
          <TaskTypeFilter />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            minWidth: '800px',
            maxWidth: '800px',
            overflow: 'scroll',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
