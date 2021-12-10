import PreviousTaskEmptyState from './PreviousTaskEmptyState';
import ReviewTaskEmptyState from './ReviewTaskEmptyState';
import CurrentTaskLoadingState from './CurrentTaskLoadingState';

export default function TaskColumnEmptyState() {
  return (
    <div>
      <div className="text-left">
        <div>
          <p className="my-3 font-semibold text-gray-400">Current Task</p>
          <CurrentTaskLoadingState />
        </div>
        <div>
          <p className="mt-6 mb-3 font-semibold text-gray-400">
            Tasks In Review
          </p>
          <ReviewTaskEmptyState />
          <ReviewTaskEmptyState />
          <p className="mt-6 mb-3 font-semibold text-gray-400">
            Previous Tasks
          </p>
          <PreviousTaskEmptyState />
          <PreviousTaskEmptyState />
          <PreviousTaskEmptyState />
        </div>
      </div>
    </div>
  );
}