import { Input, InputAdornment } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import { createStyles, makeStyles } from '@material-ui/styles';
import React, { ChangeEvent, useContext } from 'react';
import setActiveSearchTerm from 'src/actions/setActiveSearchTerm';
import { AppDataContext } from '../../contexts/AppContext';
import TaskTypeFilter from './TaskTypeFilter';

interface OwnProps {
  children: JSX.Element;
}

const useStyles = makeStyles(() =>
  createStyles({
    title: {
      fontWeight: 600,
    },
  })
);

export default function TaskListContainer({ children }: OwnProps) {
  const { dispatch } = useContext(AppDataContext);
  const classes = useStyles();

  const handleSearchTermChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setActiveSearchTerm(e.target.value));
  };
  return (
    <div>
      <Typography
        variant="subtitle1"
        gutterBottom
        className={`${classes.title} flex justify-center`}
      >
        Available Tasks
      </Typography>
      <div
        style={{
          border: '1px solid rgb(224, 224, 224)',
          borderRadius: '6px',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '20px',
            background: 'white',
            borderTopLeftRadius: '6px',
            borderTopRightRadius: '6px',
          }}
        >
          <Input
            placeholder="Search skills"
            className=" text-sm font-light text-gray-700 bg-gray-200 py-1 px-2 rounded-full"
            style={{
              height: '32px',
              flexGrow: 1,
              marginRight: '10px',
              fontSize: '13px',
            }}
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
