import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import NextLink from 'next/link';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';

export const SignIn = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  @@ -24,68 +12,43 @@ export const SignIn = () => {
    };

    return (<>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={ {
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          } }
        >
          <Avatar sx={ { m: 1, bgcolor: 'secondary.main' } }>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Log in to access the Cottage app
          </Typography>
          <Box component="form" onSubmit={ handleSubmit } noValidate sx={ { mt: 1 } }>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={ <Checkbox value="remember" color="primary" /> }
              label="Remember me"
            />
            <Button type="submit" fullWidth variant="contained" sx={ { mt: 3, mb: 2 } }>
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <NextLink href="/forgot-password" passHref={true}>
                  <Link variant="body2">
                    Forgot password?
                  </Link>
                </NextLink>
              </Grid>
              <Grid item>
                <NextLink href="/signup" passHref={true}>
                  <Link variant="body2">
                    { "Don't have an account? Sign Up" }
                  </Link>
                </NextLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>);
  }
