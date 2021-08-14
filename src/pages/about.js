import React from 'react';
import ProTip from '../ProTip';
import Copyright from '../Copyright';
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
