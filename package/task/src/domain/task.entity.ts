export type TaskProps = {
	id: string
	name: string
	description?: string
	dueDate?: Date
	createdAt: Date
	updatedAt: Date
}

export class TaskEntity {
	constructor(public props: TaskProps) { }

	static create(props: TaskProps): TaskEntity {
		return new TaskEntity(props)
	}
}
