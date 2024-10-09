
import { ObjectIdSchema } from '@taskarr/common'
import { Static, Type } from '@taskarr/typebox'

export enum TaskStatus {
	notUrgent = 0,
	dueSoon = 1,
	overDue = 2,
}

export const TaskSchemaStore = {
	id: ObjectIdSchema,
	name: Type.String({ minLength: 1, maxLength: 100 }),
	description: Type.String({ maxLength: 1000, default: '' }),
	dueDate: Type.Date(),
	status: Type.Enum(TaskStatus),
	createdAt: Type.Date(),
	updatedAt: Type.Date(),
}

export const TaskSchema = Type.ClosedObject({
	id: TaskSchemaStore.id,
	name: TaskSchemaStore.name,
	description: TaskSchemaStore.description,
	dueDate: Type.Optional(TaskSchemaStore.dueDate),
	createdAt: TaskSchemaStore.createdAt,
	updatedAt: TaskSchemaStore.updatedAt,
})

export type TaskProps = Static<typeof TaskSchema>
