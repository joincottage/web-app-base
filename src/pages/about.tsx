import React from 'react';
import ProTip from '../ProTip';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import NextLink from 'next/link';
import Copyright from '../Copyright';

export default function About() {
  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Next.js example
        </Typography>
        <NextLink href="/">
          <Button variant="contained" color="primary">
            Go to the main page
          </Button>
        </NextLink>
        <ProTip />
        <Copyright />
      </Box>
    </Container>
  );
}
