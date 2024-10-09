import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { useDefaultServiceTasksControllerGetTasks } from '@taskarr/ui/api'
import { mapTaskStatus } from 'apps/taskarr-frontend/mapper/task/task.mapper';
import Link from 'next/link'


export function Index() {
	const { data } = useDefaultServiceTasksControllerGetTasks(['tasks'], {})

	return (
		<>
			<div className='mx-auto w-5/6 h-10/12'>
				<h1 className='text-4xl font-bold my-8'>Tasks</h1>
				<TableContainer>
					<Table>
						<Thead>
							<Tr>
								<Th>Name</Th>
								<Th>Status</Th>
								<Th>Due Date</Th>
								<Th>Created At</Th>
							</Tr>
						</Thead>
						<Tbody>
							{
								data?.data.tasks.map(task => (
									<Link href={`/${task.id}`}
										className='contents cursor-pointer'>
										<Tr key={task.id}>
											<Td>{task.name}</Td>
											<Td>{mapTaskStatus(task.status)}</Td>
											<Td>{task.dueDate ? new Date(task.dueDate).toISOString() : 'No due date'}</Td>
											<Td>{new Date(task.createdAt).toISOString()}</Td>
										</Tr>
									</Link>
								))
							}
						</Tbody>
					</Table>
				</TableContainer>
			</div>
		</>
	);
}

export default Index;
