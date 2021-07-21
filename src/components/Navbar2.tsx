import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Link from 'next/link';

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
          <Typography variant="h6" component="div" sx={ { flexGrow: 1 } }>
            News
          </Typography>
          <Link href="/login" passHref={ true }><Button color="inherit">Login</Button></Link>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
