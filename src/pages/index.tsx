import React, { useContext } from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import NextLink from 'next/link';
import Copyright from '../Copyright';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { Avatar, Button } from '@material-ui/core';
import ClientTabs from 'src/components/ClientTabs';
import UserTasksColumn from 'src/components/UserTasksColumn';
import { AppDataContext } from '../contexts/AppContext';
import useClients from 'src/hooks/useClients';
import TaskList from 'src/components/TaskList';
import { Client } from '.prisma/client';

export const getServerSideProps = withPageAuthRequired();

export default function Index() {
	const { user, isLoading } = useUser();
	const { state } = useContext(AppDataContext);
	const { clients } = useClients({ shouldFetchAll: true });

	return (
		<Container maxWidth="lg">
			<Box my={4}>
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<div
						className="w-64"
						style={{
							display: 'flex',
							flexDirection: 'row-reverse',
							marginRight: '25px',
						}}
					>
						<ClientTabs clients={clients} />
					</div>
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								marginBottom: '15px',
							}}
						>
							<span style={{ marginRight: '15px' }}>
								{(state.selectedClient as Client).logoUrl && (
									<Avatar
										sx={{ width: 80, height: 80 }}
										alt="Company logo"
										src={(state.selectedClient as Client).logoUrl as string}
										aria-haspopup="true"
									/>
								)}
							</span>
							<Typography variant="h6" style={{ paddingRight: '30px' }}>
								{state.selectedClient.name}
							</Typography>
						</div>
						<div className="flex flex-col min-w-[600px] max-w-[600px] max-h-[84vh] overflow-y-scroll no-scrollbar">
							<TaskList />
						</div>
					</div>
					<div className="w-64">
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
