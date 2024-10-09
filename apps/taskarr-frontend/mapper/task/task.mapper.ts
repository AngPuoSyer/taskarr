import { GetTaskResponse } from "@taskarr/ui/api";

export function mapTaskFromJSON(task: GetTaskResponse['data']['task']) {
	return {
		id: task.id,
		name: task.name,
		description: task.description,
		status: task.status,
		dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
		createdAt: new Date(task.createdAt),
	};
}
