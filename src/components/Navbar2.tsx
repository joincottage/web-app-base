import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import NextLink from 'next/link';
import MuiLink from '@material-ui/core/Link';
import { styled } from '@material-ui/core/styles';

const Div = styled(MuiLink)(({ theme }) => ({
  ...theme.typography.h6,
  // backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1),
  flexGrow: 1,
  color: '#fff',
  textDecoration: 'none',
}));

export const Navbar2 = () => {
  return (
    <Box sx={ { flexGrow: 1 } }>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={ { mr: 2 } }
          >
            <MenuIcon />
          </IconButton>
          <NextLink href="/" passHref={true}>
            {/*<MuiLink component="typography" variant="h6">*/}
            {/*  <Typography variant="h6" sx={ { flexGrow: 1 } }>*/}
            <Div>
              Cottage
            </Div>
              {/*</Typography>*/}
            {/*</MuiLink>*/}
          </NextLink>
          <NextLink href="/login" passHref={ true }>
            <Button color="inherit">Login</Button>
          </NextLink>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
