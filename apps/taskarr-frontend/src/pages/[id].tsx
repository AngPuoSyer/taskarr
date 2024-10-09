import { Button, Center, Flex, Spacer, useDisclosure } from '@chakra-ui/react';
import { useDefaultServiceTaskControllerGetTask } from '@taskarr/ui/api';
import { EditTaskFormModal } from '@taskarr/ui/components';
import { mapTaskFromJSON } from 'apps/taskarr-frontend/mapper/task/task.mapper';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { GrEdit } from 'react-icons/gr';

export default function TaskPage() {
	const router = useRouter();
	const { id } = router.query;

	const { isOpen, onOpen, onClose } = useDisclosure();

	const { data } = useDefaultServiceTaskControllerGetTask({ id: id as string }, [], {
		enabled: router.isReady,
	});

	const task = useMemo(() => {
		if (!data) return null;
		return mapTaskFromJSON(data.data.task);
	}, [data])

	return (
		<div className='mx-auto w-5/6 h-10/12'>
			<Flex alignItems={'center'}>
				<h1 className='text-4xl font-bold my-8'>Task</h1>
				<Spacer />
				<Button leftIcon={<GrEdit />} onClick={onOpen}>Edit</Button>
			</Flex>
			{task && <div>
				<h2 className='text-2xl font-medium mb-4'>Task Name: {task.name}</h2>
				<p className='my-2'>Description: {task.description}</p>
				<p>Due Date: {task.dueDate ? task.dueDate.toDateString() : 'No due date'}</p>
			</div>}
			{
				router.isReady && data && <EditTaskFormModal
					isOpen={isOpen}
					onClose={onClose}
					isCentered
					task={{
						id: data.data.task.id,
						name: data.data.task.name,
						description: data.data.task.description as string,
						dueDate: data.data.task.dueDate ? new Date(data.data.task.dueDate) : undefined
					}}
				/>
			}
		</div>
	);
}
