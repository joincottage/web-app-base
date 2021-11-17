import React, { useContext } from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import NextLink from 'next/link';
import Copyright from '../Copyright';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import TaskCard from '../components/TaskCard';
import useTasks from 'src/hooks/useTasks';
import { Task } from '@prisma/client';
import { Avatar, Button } from '@material-ui/core';
import { AccountIconMenu } from 'src/components/AccountIconMenu';
import ClientTabs from 'src/components/ClientTabs';
import UserTasksColumn from 'src/components/UserTasksColumn';
import { AppDataContext } from '../contexts/AppContext';
import Divider from '@material-ui/core/Divider';
import useClients from 'src/hooks/useClients';
import TaskCardSkeleton from 'src/components/TaskCardSkeleton';

export const getServerSideProps = withPageAuthRequired();

export default function Index() {
	const { loading, error, data } = useTasks();
	const { user, isLoading } = useUser();
	const { state } = useContext(AppDataContext);
	const { clients } = useClients({ shouldFetchAll: true });

	return (
		<Container maxWidth="lg">
			<Box my={4}>
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<div>
						<ClientTabs
							clients={clients.map((c) => ({
								name: c.name as string,
								logo: (
									<Avatar
										sx={{ width: 24, height: 24 }}
										alt="Company logo"
										src={c.logoUrl as string}
										aria-haspopup="true"
									/>
								),
								largeLogo: (
									<Avatar
										sx={{ width: 80, height: 80 }}
										alt="Company logo"
										src={c.logoUrl as string}
										aria-haspopup="true"
									/>
								),
							}))}
						/>
					</div>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							minWidth: '600px',
							maxWidth: '600px',
						}}
					>
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								marginBottom: '15px',
							}}
						>
							<span style={{ marginRight: '15px' }}>
								{state.client.largeLogo}
							</span>
							<Typography variant="h6" style={{ paddingRight: '30px' }}>
								{state.client.name}
							</Typography>
						</div>
						{loading ? (
							<div>
								<TaskCardSkeleton />
								<TaskCardSkeleton />
								<TaskCardSkeleton />
								<TaskCardSkeleton />
								<TaskCardSkeleton />
							</div>
						) : error ? (
							JSON.stringify(error)
						) : state.client.name === 'All' ? (
							data
								?.filter((task: Task) => task.status === 'task_queued')
								.map((task: Task) => (
									<>
										<Divider />
										<TaskCard key={task.id} task={task} mode="freelancer" />
									</>
								))
						) : (
							data
								?.filter(
									(task: Task) =>
										task.clientName === state.client.name &&
										task.status === 'task_queued'
								)
								.map((task: Task) => (
									<>
										<Divider />
										<TaskCard key={task.id} task={task} mode="freelancer" />
									</>
								))
						)}
					</div>
					<div>
						{!isLoading && user ? (
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'center',
									alignItems: 'center',
									marginLeft: '25px',
								}}
							>
								<UserTasksColumn user={user} />
							</div>
						) : (
							!isLoading && (
								<NextLink href="/api/auth/login" passHref={true}>
									<Button color="inherit">Login</Button>
								</NextLink>
							)
						)}
					</div>
				</div>
				<Copyright />
			</Box>
		</Container>
	);
}
