import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles } from '@material-ui/styles';
import CurrentTaskLoadingState from './CurrentTaskLoadingState';
import PreviousTaskEmptyState from './PreviousTaskEmptyState';
import ReviewTaskEmptyState from './ReviewTaskEmptyState';

const useStyles = makeStyles(() =>
  createStyles({
    title: {
      fontWeight: 600,
    },
  })
);

export default function TaskColumnEmptyState() {
  const classes = useStyles();

  return (
    <div className="text-left">
      <div>
        <Typography variant="subtitle1" gutterBottom className={classes.title}>
          Your Current Task
        </Typography>
        <CurrentTaskLoadingState />
      </div>
      <div>
        <Typography
          variant="subtitle1"
          gutterBottom
          className={classes.title}
          style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}
        >
          Your Tasks In Review
        </Typography>
        <ReviewTaskEmptyState />
        <ReviewTaskEmptyState />
        <Typography
          variant="subtitle1"
          gutterBottom
          className={classes.title}
          style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}
        >
          Your Completed Tasks
        </Typography>
        <PreviousTaskEmptyState />
        <PreviousTaskEmptyState />
        <PreviousTaskEmptyState />
      </div>
    </div>
  );
}
