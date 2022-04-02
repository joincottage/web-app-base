import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MuiLink from '@mui/material/Link';
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import HelpIcon from '@mui/icons-material/Help';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import useClient from 'src/hooks/useClients';

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

  const handleClickHelp = () => {
    window.open(
      'https://stormy-equipment-95d.notion.site/Freelancer-ed8e005142cb475193063738be937175',
      '_blank'
    );
  };

  return (
    <Box sx={{ flexGrow: 1 }} style={{ position: 'relative', zIndex: 40 }}>
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
            {user ? (
              <div style={{ flexGrow: 1, display: 'flex' }}>
                <NextLink href="/" passHref={true}>
                  <Button
                    variant={router.pathname == '/' ? 'outlined' : 'text'}
                    style={
                      router.pathname == '/' ? activeStyles : inactiveStyles
                    }
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
            ) : null}
            <IconButton
              color="inherit"
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleClickHelp}
              style={{ color: 'white' }}
            >
              <HelpIcon style={{ cursor: 'pointer' }} />
            </IconButton>
            {/* <IconButton style={{ color: 'white' }}>
              <ChatIcon
                onClick={handleRouteToChat}
                style={{ cursor: 'pointer' }}
              />
            </IconButton> */}
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
};
