import { Type, Static } from "@taskarr/typebox";
import { TaskSchemaStore } from "../../domain/types";

export const TaskPresenterSchema = Type.ClosedObject({
	id: TaskSchemaStore.id,
	name: TaskSchemaStore.name,
	description: Type.Optional(TaskSchemaStore.description),
	dueDate: Type.Optional(TaskSchemaStore.dueDate),
	status: TaskSchemaStore.status,
	createdAt: TaskSchemaStore.createdAt,
})

export type TaskPresenter = Static<typeof TaskPresenterSchema>
