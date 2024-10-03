export type TaskProps = {
	id: string
	name: string
	description?: string
	dueDate?: Date
	createdAt: Date
	updatedAt: Date
}

export class TaskEntity {
	constructor(private readonly props: TaskProps) { }
}
