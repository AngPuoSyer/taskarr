import { Injectable } from "@nestjs/common";
import { TaskRepository } from "../infra/repository/task.repository";
import { TaskEntity } from "../domain/task.entity";

@Injectable()
export class TaskService {
	constructor(
		private readonly taskRepo: TaskRepository
	) { }

	getTask(params: { id: string }) {
		return this.taskRepo.findOneById(params.id)
	}

	getTasks() {
		return this.taskRepo.findAll()
	}

	createTask(params: {
		name: string,
		description: string,
		dueDate?: Date,
	}) {
		const entity = TaskEntity.createNew(params)
		return this.taskRepo.create(entity)
	}

	updateTask(params: {
		// separate fields to query with fields for update
		taskId: string,
		task: {
			name?: string,
			description?: string,
			dueDate?: Date | null,
		}
	}) {
		return this.taskRepo.updateOneById(params.taskId, params.task)
	}

	deleteTask(params: { id: string }) {
		return this.taskRepo.deleteOneById(params.id)
	}
}
