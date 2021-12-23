import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import NextLink from 'next/link';
import MuiLink from '@material-ui/core/Link';
import { useUser } from '@auth0/nextjs-auth0';
import { styled } from '@material-ui/core/styles';
import { AccountIconMenu } from './menus/AccountIconMenu';
import Container from '@material-ui/core/Container';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import HelpIcon from '@material-ui/icons/Help';
import useClient from 'src/hooks/useClients';
import { Avatar } from '@material-ui/core';
import { useEffect } from 'react';
import Divider from '@material-ui/core/Divider';
import { useRouter } from 'next/router';
import HelpMenu from './menus/HelpMenu';
import ChatIcon from '@material-ui/icons/Chat';

const Div = styled(MuiLink)(({ theme }) => ({
  ...theme.typography.h6,
  // backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1),
  flexGrow: 1,
  color: '#fff',
  textDecoration: 'none',
}));

const activeStyles = {
  color: 'white',
  borderColor: 'white',
};
const inactiveStyles = {
  color: 'white',
  opacity: 0.5,
};

export const Navbar = (): JSX.Element => {
  const { user, isLoading } = useClient();
  const router = useRouter();

  const handleRouteToChat = () => {
    router.push('/chat');
  };
  const handleClickHelp = () => {
    window.open(
      'https://stormy-equipment-95d.notion.site/Freelancer-ed8e005142cb475193063738be937175',
      '_blank'
    );
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Container maxWidth="lg">
          <Toolbar>
            {/* <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton> */}
            <NextLink href="/" passHref={true}>
              <img
                src="./logo.svg"
                alt="Cottage Logo"
                width="200"
                height="38"
                style={{ cursor: 'pointer' }}
              />
            </NextLink>
            <NextLink href="/" passHref={true}>
              {/*<MuiLink component="typography" variant="h6">*/}
              {/*  <Typography variant="h6" sx={ { flexGrow: 1 } }>*/}
              <Div></Div>
              {/*</Typography>*/}
              {/*</MuiLink>*/}
            </NextLink>
            <div style={{ flexGrow: 1, display: 'flex' }}>
              <NextLink href="/" passHref={true}>
                <Button
                  variant={router.pathname == '/' ? 'outlined' : 'text'}
                  style={router.pathname == '/' ? activeStyles : inactiveStyles}
                >
                  Freelancer Mode
                </Button>
              </NextLink>
              <Divider
                orientation="vertical"
                style={{
                  backgroundColor: 'white',
                  height: '35px',
                  marginRight: '15px',
                  marginLeft: '15px',
                }}
              />
              <NextLink href="/manage-tasks" passHref={true}>
                <Button
                  variant={
                    router.pathname == '/manage-tasks' ? 'outlined' : 'text'
                  }
                  style={
                    router.pathname == '/manage-tasks'
                      ? activeStyles
                      : inactiveStyles
                  }
                >
                  Client Mode
                </Button>
              </NextLink>
            </div>
            <IconButton
              color="inherit"
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleClickHelp}
              style={{ color: 'white' }}
            >
              <HelpIcon style={{ cursor: 'pointer' }} />
            </IconButton>
            <IconButton style={{ color: 'white' }}>
              <ChatIcon
                onClick={handleRouteToChat}
                style={{ cursor: 'pointer' }}
              />
            </IconButton>
            {!isLoading && user ? (
              <>
                <AccountIconMenu
                  user={user}
                  style={{
                    transform: 'scale(1.3)',
                    width: '24px',
                    height: '24px',
                    marginLeft: '15px',
                  }}
                />
              </>
            ) : (
              !isLoading && (
                <NextLink href="/api/auth/login" passHref={true}>
                  <Button color="inherit">Login</Button>
                </NextLink>
              )
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
};
