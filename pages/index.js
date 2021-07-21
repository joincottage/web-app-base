import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ProTip from '../src/ProTip';
import NextLink from 'next/link';
import Copyright from '../src/Copyright';

export default function Index() {
  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Next.js example
        </Typography>
        <NextLink href="/about" color="secondary">
          Go to the about page
        </NextLink>
        <ProTip />
        <Copyright />
      </Box>
    </Container>
  );
}
