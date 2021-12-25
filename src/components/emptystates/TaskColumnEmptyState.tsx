import PreviousTaskEmptyState from './PreviousTaskEmptyState';
import ReviewTaskEmptyState from './ReviewTaskEmptyState';
import CurrentTaskLoadingState from './CurrentTaskLoadingState';

export default function TaskColumnEmptyState() {
  return (
    <div>
      <div className="text-left">
        <div>
          <p className="my-3 font-semibold">Your Current Task</p>
          <CurrentTaskLoadingState />
        </div>
        <div>
          <p className="mt-6 mb-3 font-semibold">Your Tasks In Review</p>
          <ReviewTaskEmptyState />
          <ReviewTaskEmptyState />
          <p className="mt-6 mb-3 font-semibold">Your Completed Tasks</p>
          <PreviousTaskEmptyState />
          <PreviousTaskEmptyState />
          <PreviousTaskEmptyState />
        </div>
      </div>
    </div>
  );
}
