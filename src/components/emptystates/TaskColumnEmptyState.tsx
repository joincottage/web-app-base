import PreviousTaskEmptyState from './PreviousTaskEmptyState';
import ReviewTaskEmptyState from './ReviewTaskEmptyState';
import CurrentTaskLoadingState from './CurrentTaskLoadingState';
import Typography from '@material-ui/core/Typography';

export default function TaskColumnEmptyState() {
  return (
    <div className="text-left">
      <div>
        <Typography variant="subtitle1" gutterBottom className="font-semibold">
          Your Current Task
        </Typography>
        <CurrentTaskLoadingState />
      </div>
      <div>
        <Typography
          variant="subtitle1"
          gutterBottom
          className="mt-6 mb-3 font-semibold"
        >
          Your Tasks In Review
        </Typography>
        <ReviewTaskEmptyState />
        <ReviewTaskEmptyState />
        <Typography
          variant="subtitle1"
          gutterBottom
          className="mt-6 mb-3 font-semibold"
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
