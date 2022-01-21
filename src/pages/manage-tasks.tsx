import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import KanbanBoard from 'src/components/KanbanBoard';

export const getServerSideProps = withPageAuthRequired();

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    textAlign: 'center',
    minHeight: '405px',
  },
}));

export default function ManageTasks() {
  const classes = useStyles();
  return (
    <Container
      maxWidth={false}
      style={{
        display: 'flex',
        height: 'calc(100% - 64px)',
        minWidth: '100vw',
        overflow: 'hidden',
        padding: 0,
        margin: 0,
        position: 'relative',
        zIndex: 30,
      }}
    >
      <div className={classes.root}>
        <KanbanBoard />
      </div>
    </Container>
  );
}
