import {
	Button,
	Flex,
	Spacer,
	Table,
	TableContainer,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
	useDisclosure
} from '@chakra-ui/react';
import { useDefaultServiceTasksControllerGetTasks } from '@taskarr/ui/api'
import { CreateTaskFormModal, TaskStatusBadge } from '@taskarr/ui/components'
import { mapTaskFromJSON } from '../../mapper/task/task.mapper';
import Link from 'next/link';
import { GrAdd } from "react-icons/gr";
import { mapDateToDateString } from '../../mapper/data';

export function Index() {
	const { isOpen, onOpen, onClose } = useDisclosure()
	const { data } = useDefaultServiceTasksControllerGetTasks()

	return (
		<>
			<div className='mx-auto w-5/6 h-10/12 mb-8'>
				<Flex alignItems={'center'}>
					<h1 className='text-4xl font-bold my-8'>Tasks</h1>
					<Spacer />
					<Button leftIcon={<GrAdd />} colorScheme='blue' onClick={onOpen}>Create</Button>
				</Flex>
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
								data?.data.tasks.map(task => {
									const mappedTask = mapTaskFromJSON(task)
									return (
										<Link href={`/${task.id}`}
											key={task.id}
											className='contents cursor-pointer'>
											<Tr key={mappedTask.id}>
												<Td>{mappedTask.name}</Td>
												<Td><TaskStatusBadge status={mappedTask.status} /></Td>
												<Td>{mappedTask.dueDate ? mapDateToDateString(mappedTask.dueDate) : 'No Due Date'}</Td>
												<Td>{mapDateToDateString(mappedTask.createdAt)}</Td>
											</Tr>
										</Link>
									)
								})
							}
						</Tbody>
					</Table>
				</TableContainer>
				<CreateTaskFormModal isOpen={isOpen} onClose={onClose} isCentered />
			</div>
		</>
	);
}

export default Index;
