import { PartialDeep } from "type-fest";
import { TaskPresenter } from "./types";
import { TaskFixture } from "../../domain/task.fixture";

export class TaskPresenterFixture {
	static generateTaskPresenter(props?: PartialDeep<TaskPresenter>) {
		const taskProps = TaskFixture.generateTaskProps()
		const entity = TaskFixture.generateTaskEntity(taskProps)

		return {
			id: props?.id ?? taskProps.id,
			name: props?.name ?? taskProps.name,
			description: props?.description ?? taskProps.description,
			dueDate: props?.dueDate ?? taskProps.dueDate,
			status: props?.status ?? entity.getStatus(),
			createdAt: props?.createdAt ?? taskProps.createdAt,
		}
	}
}
