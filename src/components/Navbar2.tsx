import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import NextLink from 'next/link';
import MuiLink from '@material-ui/core/Link';
import { useUser } from '@auth0/nextjs-auth0';
import { styled } from '@material-ui/core/styles';
import { AccountIconMenu } from './AccountIconMenu';

const Div = styled(MuiLink)(({ theme }) => ({
  ...theme.typography.h6,
  // backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1),
  flexGrow: 1,
  color: '#fff',
  textDecoration: 'none',
}));

export const Navbar2 = () => {
  const { user, isLoading } = useUser();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <NextLink href="/" passHref={true}>
            {/*<MuiLink component="typography" variant="h6">*/}
            {/*  <Typography variant="h6" sx={ { flexGrow: 1 } }>*/}
            <Div>Cottage</Div>
            {/*</Typography>*/}
            {/*</MuiLink>*/}
          </NextLink>
          {!isLoading && user ? (
            <AccountIconMenu user={{}} />
          ) : (
            !isLoading && (
              <NextLink href="/api/auth/login" passHref={true}>
                <Button color="inherit">Login</Button>
              </NextLink>
            )
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};
