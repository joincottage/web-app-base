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
      <Typography
        variant="subtitle1"
        gutterBottom
        className="font-semibold flex justify-center"
      >
        Available Tasks
      </Typography>
      <div
        style={{
          backgroundColor: 'white',
          border: '1px solid rgb(224, 224, 224)',
          borderRadius: '6px',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '20px 40px',
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
