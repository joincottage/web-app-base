import { useState, useEffect } from 'react';
import { UserProfile, useUser } from '@auth0/nextjs-auth0';
import { Task } from '.prisma/client';
import axios from 'axios';

interface OwnProps {
	task: Task;
}

export default function CurrentTask({ task }: OwnProps) {
	const { user } = useUser();
	const [isShowingMenu, setIsShowingMenu] = useState(false);
	const [isShowingAbandon, setIsShowingAbandon] = useState(false);
	const [confirmDelete, setConfirmDelete] = useState('');
	const confirmDeleteCheck = `${task.clientName}/${task.name}`;

	useEffect(() => {
		//console.log('Current Task:', task);
	}, []);

	function toggleMenu() {
		setIsShowingMenu(!isShowingMenu);
	}
	function toggleAbandon() {
		setIsShowingAbandon(!isShowingAbandon);
	}
	function resetAllPops() {
		setIsShowingAbandon(false);
		setIsShowingMenu(false);
		setConfirmDelete('');
	}

	//TODO: create api for handleSubmit
	async function handleSubmit() {
		const response = await axios.put('/api/tasks/current', { task: task });
		console.log(response);
	}
	async function abandonTask() {
		resetAllPops();
		if (user === undefined) {
			console.log('user is undefined');
			return;
		}
		const response = await axios.put('/api/tasks/abandon-task', {
			task: task,
			discordChannelId: task.discordChannelId,
			discordUserId: user.sub?.split('|')[2],
		});
		console.log(response);
	}

	return (
		<>
			{isShowingAbandon ? (
				<div className="absolute top-0 left-0 z-50 bg-black bg-opacity-90 grid place-content-center w-screen h-screen">
					<div className="bg-gray-200 p-6 rounded-lg max-w-lg text-center">
						<p className="my-3 text-red-700 font-semibold text-2xl">
							Are you sure?
						</p>
						<p className="text-center mb-8 mx-6">
							Abandoning this current task will mean you won't be paid for the
							work done until this point.
						</p>
						<div className="flex flex-col my-2">
							<label className="my-3" htmlFor="delete">
								Please type
								<span className="mx-2 py-1 px-2 rounded-lg bg-gray-300 font-medium">
									{task.clientName}/{task.name}
								</span>
								to confirm.
							</label>
							<input
								id="delete"
								className="mx-6 rounded leading-8 pl-2"
								type="text"
								onChange={(e) => {
									setConfirmDelete(e.target.value);
								}}
							/>
						</div>
						<div className="mt-4 flex justify-center">
							<button
								className="disabled:opacity-20  px-5 py-2 rounded bg-red-800 disabled:hover:bg-red-800 disabled:cursor-default hover:bg-red-600 text-white font-medium transition ease-in-out duration-500"
								disabled={confirmDelete !== confirmDeleteCheck}
								onClick={abandonTask}
							>
								Yes, Abandon Task
							</button>
							<button
								onClick={resetAllPops}
								className="px-3 py-1 ml-4 rounded bg-green-600 text-white font-semibold"
							>
								Keep working on task.
							</button>
						</div>
					</div>
				</div>
			) : (
				<></>
			)}
			<div className="relative">
				{isShowingMenu ? (
					<div className="absolute px-3 py-3 z-10 right-2 top-12 -left-20 bg-gray-200 shadow-md rounded">
						<div className="text-left">
							<p className="text-lg">{task.clientName}</p>
							<p className="text-sm">{task.longDesc}</p>
							<div className="mt-6 flex justify-center">
								<button
									onClick={toggleAbandon}
									className="px-3 py-2 rounded bg-red-800 hover:bg-red-600 text-red-100 font-medium hover:text-white transition ease-in-out duration-500"
								>
									Abandon Task
								</button>
								<button className="px-3 py-1 ml-4 rounded bg-indigo-300">
									Request Help
								</button>
							</div>
						</div>
					</div>
				) : (
					<></>
				)}
				<div className="bg-blue-100 text-blue-900 shadow p-4 rounded-md max-w-[15rem]">
					<div className="text-left">
						<div className="flex justify-between items-start">
							<h3 className="text-lg">{task.name}</h3>
							<button onClick={toggleMenu}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6 text-gray-400 ml-6"
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
							</button>
						</div>
						<p className="mb-4 text-green-800">${task.price}</p>
						<button
							className="bg-blue-900 hover:bg-blue-700 font-medium transform ease-in-out duration-500 w-full text-white px-3 py-2 rounded"
							onClick={handleSubmit}
						>
							Submit For Review
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
