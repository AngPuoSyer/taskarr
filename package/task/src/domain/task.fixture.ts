import { TaskEntity } from "./task.entity";
import { TaskProps } from "./types";
import { PartialDeep } from "type-fest";


export class TaskFixture {
	static generateTaskEntity(
		props?: PartialDeep<TaskProps>
	) {
		return TaskEntity.create(TaskFixture.generateTaskProps(props))
	}

	static generateTaskProps(
		props?: PartialDeep<TaskProps>
	) {
		return {
			id: props?.id ?? '60f7b3b3c9e77c001f3b3b3b',
			name: props?.name ?? 'Task Name',
			description: props?.description ?? 'Task Description',
			dueDate: props?.dueDate ?? new Date(),
			createdAt: props?.createdAt ?? new Date(),
			updatedAt: props?.updatedAt ?? new Date(),
		}
	}
}
