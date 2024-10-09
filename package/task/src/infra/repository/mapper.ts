import { Task } from "@taskarr/db";
import { TaskEntity } from "../../domain/task.entity";
import { TaskId } from "../../domain/task-id.value-object";

export class TaskRepositoryMapper {
	static fromDomainId(id: string): TaskId['_value'] {
		return Buffer.from(id, 'hex')
	}

	static fromDomain(task: TaskEntity): Omit<Task, 'task_fts_vector'> {
		return {
			id: Buffer.from(task.props.id, 'hex'),
			name: task.props.name,
			description: task.props.description,
			due_date: task.props.dueDate,
			created_at: task.props.createdAt,
			updated_at: task.props.updatedAt
		}
	}

	static toDomain(task: Omit<Task, 'task_fts_vector'>): TaskEntity {
		return new TaskEntity({
			id: task.id.toString('hex'),
			name: task.name,
			description: task.description,
			// prevent data layer type from entering the domain layer
			dueDate: task.due_date === null ? undefined : task.due_date,
			createdAt: task.created_at,
			updatedAt: task.updated_at
		})
	}
}
