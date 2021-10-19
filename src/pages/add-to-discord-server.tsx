import React, { useContext, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import NextLink from 'next/link';
import Copyright from '../Copyright';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import TaskCard from '../components/TaskCard';
import useTasks from 'src/hooks/useTasks';
import { Task } from '@prisma/client';
import { Avatar, Button } from '@material-ui/core';
import { AccountIconMenu } from 'src/components/AccountIconMenu';
import ClientTabs from 'src/components/ClientTabs';
import { AppDataContext } from '../contexts/AppContext';
import Divider from '@material-ui/core/Divider';
import Axios from 'axios';

export const getServerSideProps = withPageAuthRequired();

export default function Index() {
  const { loading, error, data } = useTasks();
  const { user, isLoading } = useUser();
  const { state } = useContext(AppDataContext);

  useEffect(async () => {
    const response = await Axios.get('/api/auth/userinfo');
    console.log(`Discord response: ${JSON.stringify(response)}`);
  }, []);
  
  return (<div>Adding you to the Cottage Discord server...</div>);
}
