import { useDefaultServiceTaskControllerGetTask } from '@taskarr/ui/api';
import { useRouter } from 'next/router';

export default function TaskPage() {
	const router = useRouter();
	const { id } = router.query;

	const { data } = useDefaultServiceTaskControllerGetTask({ id: id as string }, ['task'], {
		enabled: router.isReady
	});

	return (
		<div className='mx-auto w-5/6 h-10/12'>
			<h1 className='text-4xl font-bold my-8'>Task</h1>
			<div>
				<h2 className='text-2xl font-medium mb-4'>Task Name: {data?.data.task.name}</h2>
				<p className='my-2'>Description: {data?.data.task.description}</p>
				<p>Due Date: {data?.data.task.dueDate ? new Date(data?.data.task.dueDate).toISOString() : 'No due date'}</p>
			</div>
		</div>
	);
}
