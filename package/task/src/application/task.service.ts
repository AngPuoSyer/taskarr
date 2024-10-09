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

	getTasks(params?: {
		query?: string
		sortBy?: 'createdAt' | 'updatedAt' | 'dueDate'
		sortOrder?: 'asc' | 'desc'
	}) {
		return this.taskRepo.findAll({
			query: params?.query,
			sortBy: this.mapSortField(params?.sortBy),
			sortOrder: params?.sortOrder
		})
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

	mapSortField(sortBy?: string): 'created_at' | 'updated_at' | 'due_date' {
		if (sortBy === undefined) {
			return undefined
		}

		switch (sortBy) {
			case 'createdAt':
				return 'created_at'
			case 'updatedAt':
				return 'updated_at'
			case 'dueDate':
				return 'due_date'
			default:
				throw new Error('invalid_sort_field')
		}
	}
}
