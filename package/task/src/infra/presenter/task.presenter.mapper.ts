import { TaskEntity } from "../../domain/task.entity";

export class TaskPresenterMapper {
	static toCreateTask(task: {
		name: string,
		description?: string,
		dueDate?: string,
	}) {
		return {
			name: task.name,
			description: task.description,
			dueDate: new Date(task.dueDate),
		}
	}

	static fromDomain(task: TaskEntity) {
		return {
			id: task.props.id,
			name: task.props.name,
			description: task.props.description,
			dueDate: task.props.dueDate,
			status: task.getStatus(),
			createdAt: task.props.createdAt,
		}
	}
}
