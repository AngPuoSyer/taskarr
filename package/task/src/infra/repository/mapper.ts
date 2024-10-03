import { Task } from "@taskarr/db";
import { TaskEntity } from "../../domain/task.entity";

export class TaskRepositoryMapper {
	toDomain(task: Task): TaskEntity {
		return new TaskEntity({
			id: task.id.toString('hex'),
			name: task.name,
			description: task.description,
			dueDate: task.due_date,
			createdAt: task.created_at,
			updatedAt: task.updated_at
		})
	}
}
