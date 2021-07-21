import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ProTip from '../src/ProTip';
import Copyright from '../src/Copyright';
import NextLink from 'next/link';

export default function About() {
  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Next.js example
        </Typography>
        <NextLink href="/">
          <Button variant="contained" color="primary" naked>
            Go to the main page
          </Button>
        </NextLink>
        <ProTip />
        <Copyright />
      </Box>
    </Container>
  );
}
