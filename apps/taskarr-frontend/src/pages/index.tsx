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
import { CreateTaskFormModal } from '@taskarr/ui/components'
import { mapTaskStatus } from 'apps/taskarr-frontend/mapper/task/task.mapper';
import Link from 'next/link';
import { GrAdd } from "react-icons/gr";

export function Index() {
	const { isOpen, onOpen, onClose } = useDisclosure()
	const { data } = useDefaultServiceTasksControllerGetTasks()

	return (
		<>
			<div className='mx-auto w-5/6 h-10/12'>
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
								data?.data.tasks.map(task => (
									<Link href={`/${task.id}`}
										key={task.id}
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
				<CreateTaskFormModal isOpen={isOpen} onClose={onClose} isCentered />
			</div>
		</>
	);
}

export default Index;
