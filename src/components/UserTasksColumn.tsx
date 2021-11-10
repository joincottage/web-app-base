import { useState, useEffect } from 'react';
import { UserProfile } from '@auth0/nextjs-auth0';
import TaskEmptyState from './TaskEmptyState';
import CurrentTask from './CurrentTask';
import TasksInReview from './TasksInReview';
import { useSingleTask } from './../hooks/useSingleTask';
import Axios from 'axios';
import { Task } from '.prisma/client';

interface OwnProps {
	user: UserProfile;
}

export default function UserTaskColumn({ user }: OwnProps) {
	const [hasTask, setHasTask] = useState(true);
	const { data, loading, error } = useSingleTask();

	useEffect(() => {
		console.log('DATA', data);
	}, [data]);

	if (loading) return <div>Loading...</div>;
	return (
		<div className="flex mt-2">
			<div>
				<img
					className="mx-auto rounded-full h-20 w-20"
					src={user.picture || ''}
					alt="User Picture"
				/>
				<div className="text-left">
					<p className="my-3 font-semibold text-gray-400">Current Task</p>
					{/* @ts-ignore */}
					{data !== null && data?.message !== 'no task' ? (
						<div>
							<CurrentTask task={data as Task} />
						</div>
					) : (
						<div>
							<TaskEmptyState />
						</div>
					)}

					<p className="mt-6 font-semibold text-gray-400">Tasks In Review</p>
					<TasksInReview />
					<p className="mt-6 font-semibold text-gray-400">Previous Tasks</p>
				</div>
			</div>
		</div>
	);
}
