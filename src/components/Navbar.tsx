import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import NextLink from 'next/link';
import MuiLink from '@material-ui/core/Link';
import { useUser } from '@auth0/nextjs-auth0';
import { styled } from '@material-ui/core/styles';
import { AccountIconMenu } from './AccountIconMenu';
import Container from '@material-ui/core/Container';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import HelpIcon from '@material-ui/icons/Help';

const Div = styled(MuiLink)(({ theme }) => ({
  ...theme.typography.h6,
  // backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1),
  flexGrow: 1,
  color: '#fff',
  textDecoration: 'none',
}));

export const Navbar = (): JSX.Element => {
  const { user, isLoading } = useUser();

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
                  <img src="./logo.svg" alt="Cottage Logo" width="200" height="38" style={{ cursor: 'pointer' }} />
                </NextLink>
                <NextLink href="/" passHref={true}>
                  {/*<MuiLink component="typography" variant="h6">*/}
                  {/*  <Typography variant="h6" sx={ { flexGrow: 1 } }>*/}
                  <Div></Div>
                  {/*</Typography>*/}
                  {/*</MuiLink>*/}
                </NextLink>
                <IconButton style={{ color: 'white' }}>
                  <HelpIcon style={{ cursor: 'pointer' }} />
                </IconButton>
                <IconButton style={{ color: 'white' }}>
                  <NotificationsNoneIcon style={{ cursor: 'pointer' }} />
                </IconButton>
                {!isLoading && user ? (
                  <AccountIconMenu user={user} style={{ transform: 'scale(1.3)', width: '24px', height: '24px' }} />
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
