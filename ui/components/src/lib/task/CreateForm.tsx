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
import { useDefaultServiceTaskControllerCreateTask, useDefaultServiceTasksControllerGetTasksKey } from '@taskarr/ui/api'
import { typeboxResolver } from '@hookform/resolvers/typebox'
import { useQueryClient } from '@tanstack/react-query'

export interface CreateTaskFormModalProps extends Omit<ModalProps, 'children'> { }

// TODO: single source validation schema
const CreateTaskSchema = Type.ClosedObject({
	name: Type.String({ minLength: 1, maxLength: 100 }),
	description: Type.Optional(Type.String({ maxLength: 1000 })),
	dueDate: Type.Optional(Type.String())
})

export type CreateTaskDto = Static<typeof CreateTaskSchema>

export function CreateTaskFormModal(props: CreateTaskFormModalProps) {
	const {
		handleSubmit,
		register,
		formState: { errors, isSubmitting },
	} = useForm<CreateTaskDto>({
		resolver: typeboxResolver(CreateTaskSchema),
	})

	const queryClient = useQueryClient()
	const api = useDefaultServiceTaskControllerCreateTask({
		// TODO: error handling
		onSuccess: async () => {
			props.onClose()
			await queryClient.invalidateQueries({
				queryKey: [useDefaultServiceTasksControllerGetTasksKey]
			})
		},
	})

	function onSubmit(values: CreateTaskDto) {
		return api.mutateAsync({
			requestBody: {
				name: values.name,
				description: values.description ?? '',
				dueDate: values.dueDate ? new Date(values.dueDate).toJSON() : undefined
			}
		})
	}

	return (
		<Modal {...props}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Create Task</ModalHeader>
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
								placeholder: 'name'
							}}
							isRequired
						/>
						<HookFormInput
							errors={errors}
							label='Description'
							register={register('description')}
							fieldName='description'
							input={{
								id: 'task-description',
								placeholder: 'description',
								type: 'text'
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
