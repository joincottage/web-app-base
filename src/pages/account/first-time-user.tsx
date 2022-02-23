import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Title from '../../components/Title';
import { Typography } from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/dist/client/router';
import Axios from 'axios';

function removeItem(arr: any[], value: any) {
  const index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

const allSkills = [
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
  const router = useRouter();
  const [isPendingSubmission, setIsPendingSubmission] = useState(false);
  const [checked, setChecked] = useState<string[]>([]);
  const { user, error, isLoading } = useUser();
  if (isLoading) {
    return <div>Loading</div>;
  }
  if (error) {
    return <div>error</div>;
  }

  const handleToggle = (skill: string) => () =>
    checked.indexOf(skill) === -1
      ? setChecked([...checked, skill])
      : setChecked(removeItem(checked, skill));

  const handleStartFreelancing = async () => {
    try {
      setIsPendingSubmission(true);
      await Axios.post('/api/discord/notify-new-user', {
        name: user?.name,
        email: user?.email,
        skills: checked.join(','),
      });
    } catch (error) {
      console.error(
        `There was an error communicating with the Cottage notify-new-user api for name: ${
          user?.name
        }, email: ${user?.email}, skills: ${checked.join(',')}`,
        error
      );
      throw error;
    }
    router.push('/api/discord/invite');
  };

  return user ? (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 4 }}>
      <Grid container spacing={3}>
        <Typography variant="h2" gutterBottom>
          One last thing...
        </Typography>
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
            <Title>What skills do you have to offer clients?</Title>

            <List>
              <Grid container spacing={2}>
                {allSkills.map((skill) => (
                  <Grid item xs={12} md={4} lg={3} key={skill}>
                    <ListItem key={skill} disablePadding>
                      <ListItemButton
                        role={undefined}
                        onClick={handleToggle(skill)}
                        dense
                      >
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            checked={checked.indexOf(skill) !== -1}
                            tabIndex={-1}
                            disableRipple
                            // inputProps={{ 'aria-labelledby': labelId }}
                            onChange={handleToggle(skill)}
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
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            disabled={checked.length === 0 || isPendingSubmission}
            onClick={handleStartFreelancing}
          >
            {isPendingSubmission ? 'Submitting...' : 'Start freelancing'}
          </Button>
        </Grid>
      </Grid>
    </Container>
  ) : (
    <></>
  );
}
