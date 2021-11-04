import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemButton from '@material-ui/core/ListItemButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Title from '../../components/Title';

const skills = [
  'JavaScript',
  'TypeScript',
  'React',
  'Angular',
  'Vue',
  'React Native',
  'Java',
  'Kotlin',
  'Golang',
  'Rust',
  'Python',
  'Ruby',
  'Rails',
];

export const getServerSideProps = withPageAuthRequired();

export default function Profile(): JSX.Element {
  const { user, error, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading</div>;
  }
  if (error) {
    return <div>error</div>;
  }

  return user ? (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Account Details */}
        <Grid item xs={12} md={8} lg={9}>
          <Paper
            sx={{
              padding: 2,
              display: 'flex',
              flexDirection: 'column',
              minHeight: 240,
            }}
          >
            <Title>Account Details</Title>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  disabled
                  label="Name"
                  variant="standard"
                  fullWidth
                  defaultValue={user.name}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  disabled
                  label="Email"
                  variant="standard"
                  fullWidth
                  defaultValue={user.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Bio"
                  variant="standard"
                  fullWidth
                  multiline
                  defaultValue="Add user bio here"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        {/* Social */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            <Title>Social</Title>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Discord"
                  variant="standard"
                  defaultValue="@cooljohnny"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="LinkedIn"
                  variant="standard"
                  defaultValue="@cooljohnny"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Twitter"
                  variant="standard"
                  defaultValue="@cooljohnny"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        {/* Skills */}
        <Grid item xs={12}>
          <Paper
            sx={{
              padding: 2,
              display: 'flex',
              flexDirection: 'column',
              minHeight: 240,
            }}
          >
            <Title>Skills</Title>

            <List>
              <Grid container spacing={2}>
                {skills.map((skill) => (
                  <Grid item xs={12} md={4} lg={3} key={skill}>
                    <ListItem key={skill} disablePadding>
                      <ListItemButton
                        role={undefined}
                        // onClick={handleToggle(skill)}
                        dense
                      >
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            // checked={checked.indexOf(skill) !== -1}
                            tabIndex={-1}
                            disableRipple
                            // inputProps={{ 'aria-labelledby': labelId }}
                          />
                        </ListItemIcon>
                        <ListItemText id={skill} primary={skill} />
                      </ListItemButton>
                    </ListItem>
                  </Grid>
                ))}
              </Grid>
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained">Update</Button>
        </Grid>
      </Grid>
    </Container>
  ) : (
    <></>
  );
}
