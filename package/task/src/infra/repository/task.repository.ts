import { Injectable } from "@nestjs/common";
import { InjectKysely } from "nestjs-kysely";
import { type Kysely } from "kysely";
import type { Db } from '@taskarr/db'
import { TaskEntity } from "../../domain/task.entity";
import { TaskRepositoryMapper } from "./mapper";
import { isEmpty } from "lodash";

@Injectable()
export class TaskRepository {
	constructor(
		@InjectKysely() private readonly db: Kysely<Db>
	) { }

	async findOneById(id: string): Promise<TaskEntity | null> {
		const task = await this.db.selectFrom('task')
			.where('id', '=', TaskRepositoryMapper.fromDomainId(id))
			.selectAll()
			.executeTakeFirst()

		if (isEmpty(task)) {
			return null
		}

		return TaskRepositoryMapper.toDomain(task)
	}

	async create(task: TaskEntity) {
		if (!task.isNew) {
			throw new Error('task_already_exists')
		}

		await this.db.insertInto('task')
			.values(TaskRepositoryMapper.fromDomain(task))
			.execute()

		task.created()

		return task
	}

	async findAll(): Promise<TaskEntity[]> {
		const tasks = await this.db.selectFrom('task').selectAll().execute()

		const tasksEntity = []
		for (const task of tasks) {
			tasksEntity.push(TaskRepositoryMapper.toDomain(task))
		}

		return tasksEntity
	}

	async updateOneById(id: string, task: {
		name?: string,
		description?: string,
		dueDate?: Date | null
	}) {
		const value = await this.db.updateTable('task')
			.set({
				name: task.name,
				description: task.description,
				due_date: task.dueDate
			})
			.where('id', '=', TaskRepositoryMapper.fromDomainId(id))
			.returningAll()
			.executeTakeFirst()

		return TaskRepositoryMapper.toDomain(value)
	}

	async deleteOneById(id: string) {
		const value = await this.db.deleteFrom('task')
			.where('id', '=', TaskRepositoryMapper.fromDomainId(id))
			.executeTakeFirst()

		return value.numDeletedRows > 0
	}
}
