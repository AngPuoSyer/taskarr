import { useForm } from 'react-hook-form'
import {
	Button,
	HStack,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	ModalProps,
} from '@chakra-ui/react'
import { HookFormInput } from '../common/HookFormInput'
import { Static, Type } from '@taskarr/typebox'
import {
	UseDefaultServiceTaskControllerGetTaskKeyFn,
	useDefaultServiceTaskControllerUpdateTask,
	useDefaultServiceTasksControllerGetTasksKey,
} from '@taskarr/ui/api'
import { typeboxResolver } from '@hookform/resolvers/typebox'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { isEmpty } from 'lodash'

export interface EditTaskFormModalProps extends Omit<ModalProps, 'children'> {
	task: {
		id: string,
		name: string,
		description: string,
		dueDate: Date | undefined,
	}
}

// TODO: single source validation schema
const EditTaskSchema = Type.ClosedObject({
	name: Type.Optional(Type.String({ minLength: 1, maxLength: 100 })),
	description: Type.Optional(Type.String({ maxLength: 1000 })),
	dueDate: Type.Optional(Type.Union([Type.String(), Type.Null()]))
})

export type EditTaskDto = Static<typeof EditTaskSchema>

export function EditTaskFormModal(props: EditTaskFormModalProps) {
	const {
		handleSubmit,
		register,
		formState: { errors, isSubmitting, dirtyFields },
	} = useForm<EditTaskDto>({
		resolver: typeboxResolver(EditTaskSchema),
	})

	const queryClient = useQueryClient()
	const api = useDefaultServiceTaskControllerUpdateTask({
		// TODO: error handling
		onSuccess: async () => {
			console.log(UseDefaultServiceTaskControllerGetTaskKeyFn({ id: props.task.id }),)
			// TODO: figure out how to invalidate only the task, generated code is not invalidating correctly
			await queryClient.invalidateQueries()
			props.onClose()
		},
	})

	function onSubmit(values: EditTaskDto) {
		let body: EditTaskDto = {}
		let dueDate

		for (const [key, value] of Object.entries(values)) {
			const k = key as keyof EditTaskDto
			if (dirtyFields[k]) {
				body[k] = values[k] as any
			}
		}

		if (dirtyFields.dueDate) {
			if (isEmpty(values.dueDate)) {
				if (isEmpty(props.task.dueDate)) {
					dueDate = undefined
				}
				dueDate = null
			}
			else {
				dueDate = new Date(values.dueDate as string).toJSON()
			}
		}
		body.dueDate = dueDate

		return api.mutateAsync({
			id: props.task.id,
			requestBody: body
		})
	}

	return (
		<Modal {...props}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Edit Task</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<form onSubmit={handleSubmit(onSubmit)}>
						<HookFormInput
							errors={errors}
							label='Name'
							register={register('name')}
							fieldName='name'
							input={{
								id: 'task-name',
								placeholder: 'name',
								defaultValue: props.task.name
							}}
						/>
						<HookFormInput
							errors={errors}
							label='Description'
							register={register('description')}
							fieldName='description'
							input={{
								id: 'task-description',
								placeholder: 'description',
								type: 'text',
								defaultValue: props.task.description
							}}
						/>
						<HookFormInput
							errors={errors}
							label='Due Date'
							register={register('dueDate')}
							fieldName='dueDate'
							input={{
								id: 'task-dueDate',
								placeholder: 'Due Date',
								type: 'date',
								defaultValue: props.task.dueDate ? dayjs(props.task.dueDate).format('YYYY-MM-DD') : undefined,
							}}
						/>
						<ModalFooter>
							<HStack spacing={'24px'}>
								<Button colorScheme='blue' onClick={props.onClose}>
									Close
								</Button>
								<Button colorScheme='teal' isLoading={isSubmitting} type='submit'>
									Submit
								</Button>
							</HStack>
						</ModalFooter>
					</form>
				</ModalBody>
			</ModalContent>
		</Modal>
	)
}
