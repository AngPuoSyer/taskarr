import { Injectable } from "@nestjs/common";
import { InjectKysely } from "nestjs-kysely";
import type { Kysely } from "kysely";
import type { Db } from '@taskarr/db'
import { TaskEntity } from "../../domain/task.entity";

@Injectable()
export class TaskRepository {
	constructor(
		@InjectKysely() private readonly db: Kysely<Db>
	) { }

	async findAll(): Promise<TaskEntity[]> {
		const tasks = await this.db.selectFrom('task').selectAll().execute()

		const tasksEntity = []
		for (const task of tasks) {
			tasksEntity.push(new TaskEntity({
				id: task.id.toString('hex'),
				name: task.name,
				description: task.description,
				dueDate: task.due_date,
				createdAt: task.created_at,
				updatedAt: task.updated_at
			}))
		}

		return tasksEntity
	}
}
