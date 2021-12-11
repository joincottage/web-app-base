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

interface OwnProps {}

export default function TaskListContainer({}: OwnProps) {
  const { state, dispatch } = useContext(AppDataContext);
  const handleSearchTermChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setActiveSearchTerm(e.target.value));
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '15px',
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
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Input
          placeholder="Search skills"
          className=" text-sm font-light text-gray-700 bg-gray-200 py-1 px-2 rounded-full"
          style={{ height: '32px', width: '200px' }}
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
          minWidth: '600px',
          maxWidth: '600px',
          maxHeight: '82vh',
          overflow: 'scroll',
        }}
      >
        <TaskList />
      </div>
    </div>
  );
}
