import { GetTaskResponse } from "@taskarr/ui/api";
import { stat } from "fs";

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

export function mapTaskStatus(status: GetTaskResponse['data']['task']['status']) {
	switch (status) {
		case 0:
			return 'Not Urgent';
		case 1:
			return 'Due Soon';
		case 2:
			return 'Overdue';
		default:
			throw new Error('Invalid status');
	}
}
