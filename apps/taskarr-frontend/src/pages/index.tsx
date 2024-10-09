import {
	Button,
	Flex,
	HStack,
	Input,
	Select,
	Spacer,
	Spinner,
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
import { GrAdd } from "react-icons/gr";
import { mapDateToDateString } from '../../mapper/data';
import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import { throttle } from 'lodash';

type SortOrder = 'desc' | 'asc'
type SortBy = 'createdAt' | 'dueDate'

export function Index() {
	const router = useRouter()

	const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
	const [sortBy, setSortBy] = useState<SortBy>('dueDate')
	const [query, setQuery] = useState<string | undefined>(undefined)

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const handleSearchCallback = useCallback(throttle((value: string) => {
		setQuery(value)
	}, 1500, { leading: false }), [])


	const { isOpen, onOpen, onClose } = useDisclosure()
	const { data, isLoading } = useDefaultServiceTasksControllerGetTasks({
		sortOrder,
		sortBy,
		query
	})

	return (
		<>
			<div className='mx-auto w-5/6 h-10/12 mb-8'>
				<Flex alignItems={'center'}>
					<h1 className='text-4xl font-bold my-8'>Tasks</h1>
					<Spacer />
					<HStack className='w-8/12'>
						<Input className='w-6/12' placeholder="Search" onChange={(event) => {
							handleSearchCallback(event.target.value)
						}} />
						<Select placeholder="Sort By"
							onChange={(event) => {
								event.preventDefault()
								setSortBy(event.target.value as SortBy)
							}}
							defaultValue={sortBy}
							w='60%'
						>
							<option value='createdAt'>Created At</option>
							<option value='dueDate'>Due Date</option>
						</Select>
						<Select placeholder="Sort Order"
							onChange={(event) => {
								event.preventDefault()
								setSortOrder(event.target.value as SortOrder)
							}}
							defaultValue={sortOrder}
							w='50%'

						>
							<option value='desc'>New to Old</option>
							<option value='asc'>Old to New</option>
						</Select>
						<Button className='w-4/12 px-10' leftIcon={<GrAdd />} colorScheme='blue' onClick={onOpen}>Create</Button>
					</HStack>
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
						{
							!isLoading && <Tbody>
								{
									data?.data.tasks.map(task => {
										const mappedTask = mapTaskFromJSON(task)
										return (

											<Tr key={mappedTask.id} className='cursor-pointer' onClick={() => router.push(`/${mappedTask.id}`)}>
												<Td>{mappedTask.name}</Td>
												<Td><TaskStatusBadge status={mappedTask.status} /></Td>
												<Td>{mappedTask.dueDate ? mapDateToDateString(mappedTask.dueDate) : 'No Due Date'}</Td>
												<Td>{mapDateToDateString(mappedTask.createdAt)}</Td>
											</Tr>

										)
									})
								}
							</Tbody>
						}

					</Table>
				</TableContainer>
				{isLoading &&
					<div className='w-full flex justify-center mt-10'>
						<Spinner className='mx-auto' size='xl' />
					</div>
				}

				<CreateTaskFormModal isOpen={isOpen} onClose={onClose} isCentered />
			</div>
		</>
	);
}

export default Index;
