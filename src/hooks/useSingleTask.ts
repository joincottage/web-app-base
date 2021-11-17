import { Task } from '@prisma/client';
import { useState, useEffect } from 'react';

export const useSingleTask = () => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	//const [data, setData] = useState<Task[] | { message: string } | null>(null);
	const [data, setData] = useState<Task[] | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch('/api/tasks/current');
				const data = await response.json();
				setData(data);
				setLoading(false);
			} catch (err) {
				setError(err);
			}
		};

		fetchData();
	}, []);

	return { loading, error, data };
};
