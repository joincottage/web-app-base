import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ProTip from '../ProTip';
import NextLink from 'next/link';
import Copyright from '../Copyright';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

export const getServerSideProps = withPageAuthRequired();

export default function Index() {
  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Next.js example
        </Typography>
        <NextLink href="/about">
          Go to the about page
        </NextLink>
        <ProTip />
        <Copyright />
      </Box>
    </Container>
  );
}
