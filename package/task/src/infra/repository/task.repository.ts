import { Injectable } from "@nestjs/common";
import { InjectKysely } from "nestjs-kysely";
import { type Kysely, sql } from "kysely";
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

	async findAll(params?: {
		query?: string
		sortBy?: 'created_at' | 'updated_at' | 'due_date'
		sortOrder?: 'asc' | 'desc'
	}): Promise<TaskEntity[]> {
		let queryBuilder = this.db
			.selectFrom('task')
			.selectAll()

		if (params?.query) {
			queryBuilder = queryBuilder.where(
				'task_fts_vector',
				'@@',
				sql`to_tsquery(${this.createPartialMatchQuery(params.query)})`
			)
		}

		if (params?.sortBy) {
			queryBuilder = queryBuilder.orderBy(params.sortBy, params.sortOrder)
		}

		const tasks = await queryBuilder.execute()

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

	createPartialMatchQuery(query: string) {
		return query.split(' ').map((char) => char + ':*').join(' | ')
	}
}
