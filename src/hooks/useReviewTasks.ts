import { Task } from '@prisma/client';
import { useState, useEffect } from 'react';

export const useReviewTasks = () => {
	const [reviewLoading, setLoading] = useState(true);
	const [reviewError, setError] = useState(null);
	const [reviewTasks, setData] = useState<Task[] | { message: string } | null>(
		null
	);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch('/api/tasks/review-tasks');
				const data = await response.json();
				setData(data);
				setLoading(false);
			} catch (err) {
				setError(err);
			}
		};

		fetchData();
	}, []);

	return { reviewLoading, reviewError, reviewTasks };
};
