//import { useState, useEffect } from 'react';
import { Task } from '@prisma/client';

interface OwnProps {
	tasks: Task[];
}

export default function TasksInReview({ tasks }: OwnProps) {
	if (tasks === null || tasks.length === 0) {
		return (
			<div>
				<p className="text-gray-400 text-sm">
					You have no tasks currently in review.
				</p>
			</div>
		);
	}
	return (
		<div className="">
			{tasks.map((task) => (
				<div className="my-3 px-3 py-2 rounded bg-blue-50 shadow">
					<div className="flex justify-between my-1">
						<div className="text-left">
							<p className="mb-1">{task.name}</p>
							{task.status == 'in_review' ? (
								<p className="bg-gray-100 rounded-full px-3 text-sm text-center text-yellow-500">
									Waiting&nbsp;Approval
								</p>
							) : (
								<></>
							)}
							{task.status == 'is_approved' ? (
								<p className="bg-gray-100 rounded-full px-3 text-sm text-center text-green-500">
									Task&nbsp;Approved
								</p>
							) : (
								<></>
							)}
							{task.status == 'in_attention' ? (
								<p className="bg-gray-100 rounded-full px-3 text-sm text-center text-red-500">
									Needs&nbsp;Attention
								</p>
							) : (
								<></>
							)}
						</div>
						<div>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
								/>
							</svg>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
